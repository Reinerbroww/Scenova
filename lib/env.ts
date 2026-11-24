import "server-only";

export function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;

  if (!url) {
    throw new Error("DATABASE_URL is not configured. See .env.example.");
  }

  return url;
}

export function getGeminiConfig(): { apiKey: string; model: string } {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured. See .env.example.");
  }

  return { apiKey, model: process.env.GEMINI_MODEL?.trim() || "gemini-3.1-flash-lite" };
}
