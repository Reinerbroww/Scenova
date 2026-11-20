import type { Assumptions, CalculationResult } from "./types";

const SCALE = 100n;

/** Converts a decimal amount to integer minor units (2 decimals) without float drift. */
export function toMinorUnits(value: number | string): bigint {
  const text = typeof value === "number" ? value.toFixed(2) : value.trim();

  if (!/^\d{1,12}(\.\d{1,2})?$/.test(text)) {
    throw new Error("Invalid monetary value");
  }

  const [whole, fraction = ""] = text.split(".");
  return BigInt(whole) * SCALE + BigInt(fraction.padEnd(2, "0"));
}

function fromMinorUnits(value: bigint): number {
  return Number(value) / 100;
}

export function calculate(input: Assumptions): CalculationResult {
  const transactionValue = toMinorUnits(input.averageTransactionValue);
  const variablePerTransaction = toMinorUnits(input.variableCostPerTransaction);
  const fixedCost = toMinorUnits(input.fixedCost);
  const volume = BigInt(Math.trunc(input.transactionVolume));

  const revenue = transactionValue * volume;
  const totalVariableCost = variablePerTransaction * volume;
  const totalCost = totalVariableCost + fixedCost;
  const operatingProfit = revenue - totalCost;
  const contribution = transactionValue - variablePerTransaction;
  const breakEvenReachable = contribution > 0n;

  let operatingMargin: number | null = null;

  if (revenue > 0n) {
    const scaled = operatingProfit * 10000n;
    const rounded = scaled / revenue + (scaled % revenue) * 2n >= revenue ? scaled / revenue + 1n : scaled / revenue;
    operatingMargin = Number(rounded) / 100;
  }

  const breakEvenVolume = breakEvenReachable
    ? Number((fixedCost + contribution - 1n) / contribution)
    : null;

  return {
    revenue: fromMinorUnits(revenue),
    totalVariableCost: fromMinorUnits(totalVariableCost),
    fixedCost: fromMinorUnits(fixedCost),
    totalCost: fromMinorUnits(totalCost),
    operatingProfit: fromMinorUnits(operatingProfit),
    operatingMargin,
    contributionPerTransaction: fromMinorUnits(contribution),
    breakEvenVolume,
    breakEvenReachable,
  };
}
