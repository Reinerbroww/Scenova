import "server-only";

import { z } from "zod";
import { getGeminiConfig } from "@/lib/env";
import { buildInsightPrompt, type InsightInput } from "@/lib/ai/prompt";
import type { AiInsight } from "@/lib/ai/types";

export const insightSchema = z.object({
  summary: z.string().trim().min(1).max(600),
  strengths: z.array(z.string().trim().min(1).max(400)).max(4),
  weaknesses: z.array(z.string().trim().min(1).max(400)).max(4),
  actions: z
    .array(
      z.object({
        title: z.string().trim().min(1).max(160),
        detail: z.string().trim().min(1).max(500),
        focus: z.enum(["price", "variableCost", "fixedCost", "volume"]),
      }),
    )
    .max(4),
});

export class AiServiceError extends Error {
  constructor(
    message: string,
    readonly status = 502,
  ) {
    super(message);
    this.name = "AiServiceError";
  }
}

const responseSchema = {
  type: "OBJECT",
  properties: {
    summary: { type: "STRING" },
    strengths: { type: "ARRAY", items: { type: "STRING" } },
    weaknesses: { type: "ARRAY", items: { type: "STRING" } },
    actions: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          title: { type: "STRING" },
          detail: { type: "STRING" },
          focus: { type: "STRING", enum: ["price", "variableCost", "fixedCost", "volume"] },
        },
        required: ["title", "detail", "focus"],
      },
    },
  },
  required: ["summary", "strengths", "weaknesses", "actions"],
};

interface GeminiResponse {
  candidates?: { content?: { parts?: { text?: string }[] } }[];
}

export async function generateInsight(input: InsightInput): Promise<AiInsight> {
  const { apiKey, model } = getGeminiConfig();
  const { systemInstruction, userPrompt } = buildInsightPrompt(input);

  let response: Response;

  try {
    response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents: [{ role: "user", parts: [{ text: userPrompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema,
            temperature: 0.4,
            maxOutputTokens: 2048,
          },
        }),
        signal: AbortSignal.timeout(20000),
        cache: "no-store",
      },
    );
  } catch {
    throw new AiServiceError("AI insight is unavailable right now. Please try again later.", 503);
  }

  if (!response.ok) {
    throw new AiServiceError("AI insight is unavailable right now. Please try again later.", 503);
  }

  let text: string;

  try {
    const payload = (await response.json()) as GeminiResponse;
    text = (payload.candidates?.[0]?.content?.parts ?? [])
      .map((part) => part.text ?? "")
      .join("");
  } catch {
    throw new AiServiceError("AI insight could not be read. Please try again.");
  }

  let raw: unknown;

  try {
    raw = JSON.parse(text);
  } catch {
    throw new AiServiceError("AI insight could not be read. Please try again.");
  }

  const parsed = insightSchema.safeParse(raw);

  if (!parsed.success) {
    throw new AiServiceError("AI insight could not be read. Please try again.");
  }

  return parsed.data;
}
