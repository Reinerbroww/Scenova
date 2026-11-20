export type BusinessType = "product" | "service" | "other";
export type Period = "weekly" | "monthly" | "yearly";

export interface Assumptions {
  averageTransactionValue: number;
  variableCostPerTransaction: number;
  fixedCost: number;
  transactionVolume: number;
}

export interface CalculationResult {
  revenue: number;
  totalVariableCost: number;
  fixedCost: number;
  totalCost: number;
  operatingProfit: number;
  operatingMargin: number | null;
  contributionPerTransaction: number;
  breakEvenVolume: number | null;
  breakEvenReachable: boolean;
}
