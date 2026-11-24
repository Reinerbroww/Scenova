export type InsightFocus = "price" | "variableCost" | "fixedCost" | "volume";

export interface AiInsightAction {
  title: string;
  detail: string;
  focus: InsightFocus;
}

export interface AiInsight {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  actions: AiInsightAction[];
}
