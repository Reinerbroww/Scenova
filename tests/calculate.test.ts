import { describe, expect, it } from "vitest";
import { calculate, toMinorUnits } from "@/lib/simulation/calculate";

describe("calculate", () => {
  it("computes the approved baseline example", () => {
    const result = calculate({
      averageTransactionValue: 15000,
      variableCostPerTransaction: 6000,
      fixedCost: 5000000,
      transactionVolume: 1000,
    });

    expect(result.revenue).toBe(15000000);
    expect(result.totalVariableCost).toBe(6000000);
    expect(result.fixedCost).toBe(5000000);
    expect(result.totalCost).toBe(11000000);
    expect(result.operatingProfit).toBe(4000000);
    expect(result.operatingMargin).toBe(26.67);
    expect(result.contributionPerTransaction).toBe(9000);
    expect(result.breakEvenVolume).toBe(556);
    expect(result.breakEvenReachable).toBe(true);
  });

  it("reports unavailable margin when revenue is zero", () => {
    const result = calculate({
      averageTransactionValue: 15000,
      variableCostPerTransaction: 6000,
      fixedCost: 5000000,
      transactionVolume: 0,
    });

    expect(result.revenue).toBe(0);
    expect(result.operatingMargin).toBeNull();
    expect(result.operatingProfit).toBe(-5000000);
    expect(result.breakEvenVolume).toBe(556);
  });

  it("reports unreachable break-even when contribution is zero", () => {
    const result = calculate({
      averageTransactionValue: 100,
      variableCostPerTransaction: 100,
      fixedCost: 500,
      transactionVolume: 10,
    });

    expect(result.contributionPerTransaction).toBe(0);
    expect(result.breakEvenVolume).toBeNull();
    expect(result.breakEvenReachable).toBe(false);
    expect(result.operatingProfit).toBe(-500);
  });

  it("reports unreachable break-even when contribution is negative", () => {
    const result = calculate({
      averageTransactionValue: 100,
      variableCostPerTransaction: 150,
      fixedCost: 500,
      transactionVolume: 10,
    });

    expect(result.contributionPerTransaction).toBe(-50);
    expect(result.breakEvenVolume).toBeNull();
    expect(result.breakEvenReachable).toBe(false);
  });

  it("returns zero break-even volume when there are no fixed costs", () => {
    const result = calculate({
      averageTransactionValue: 100,
      variableCostPerTransaction: 40,
      fixedCost: 0,
      transactionVolume: 5,
    });

    expect(result.breakEvenVolume).toBe(0);
    expect(result.breakEvenReachable).toBe(true);
  });

  it("keeps decimal money exact", () => {
    const result = calculate({
      averageTransactionValue: 0.1,
      variableCostPerTransaction: 0.2,
      fixedCost: 0,
      transactionVolume: 3,
    });

    expect(result.revenue).toBe(0.3);
    expect(result.totalVariableCost).toBe(0.6);
    expect(result.operatingProfit).toBe(-0.3);
  });

  it("converts decimal strings to integer minor units", () => {
    expect(toMinorUnits("15000.99")).toBe(1500099n);
    expect(toMinorUnits("0.05")).toBe(5n);
    expect(() => toMinorUnits("-1")).toThrow("Invalid monetary value");
    expect(() => toMinorUnits("1.234")).toThrow("Invalid monetary value");
  });
});
