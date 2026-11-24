import { describe, expect, it } from "vitest";
import { buildInsightFacts, buildInsightPrompt, type InsightInput } from "@/lib/ai/prompt";

const input: InsightInput = {
  simulationName: "Kedai Kopi",
  businessName: "Kedai Kopi A",
  businessType: "service",
  period: "monthly",
  scenarioName: "Baseline",
  assumptions: {
    averageTransactionValue: 100000,
    variableCostPerTransaction: 40000,
    fixedCost: 1000000,
    transactionVolume: 50,
  },
  language: "id",
};

describe("buildInsightFacts", () => {
  it("derives the ratios the model needs to explain weaknesses", () => {
    const facts = buildInsightFacts(input);

    expect(facts.result.operatingProfit).toBe(2000000);
    expect(facts.derived.contributionMarginPercent).toBe(60);
    expect(facts.derived.revenueCoveragePercent).toBe(166.67);
    expect(facts.derived.variableCostShareOfRevenuePercent).toBe(40);
    expect(facts.derived.fixedCostShareOfTotalCostPercent).toBe(33.33);
    expect(facts.derived.breakEvenGap).toBe(-33);
  });

  it("reports no break-even gap when contribution cannot cover fixed cost", () => {
    const facts = buildInsightFacts({
      ...input,
      assumptions: { ...input.assumptions, variableCostPerTransaction: 120000 },
    });

    expect(facts.derived.breakEvenGap).toBeNull();
  });
});

describe("buildInsightPrompt", () => {
  it("asks for the requested language and treats names as data", () => {
    const { systemInstruction, userPrompt } = buildInsightPrompt(input);

    expect(systemInstruction).toContain("Bahasa Indonesia");
    expect(systemInstruction).toContain("untrusted data");
    expect(userPrompt).toContain('"scenarioName":"Baseline"');
    expect(userPrompt).toContain('"contributionMarginPercent":60');
  });

  it("asks for English when the language is en", () => {
    const { systemInstruction } = buildInsightPrompt({ ...input, language: "en" });

    expect(systemInstruction).toContain("plain English");
    expect(systemInstruction).not.toContain("Bahasa Indonesia");
  });
});
