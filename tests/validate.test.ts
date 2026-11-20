import { describe, expect, it } from "vitest";
import { loginSchema, scenarioSchema, setupSchema } from "@/lib/simulation/validate";

const validSetup = {
  simulationName: "Coffee Shop",
  businessName: "Andi Coffee",
  businessType: "service" as const,
  period: "monthly" as const,
  averageTransactionValue: "15000",
  variableCostPerTransaction: "6000",
  fixedCost: "5000000",
  transactionVolume: "1000",
};

describe("validation", () => {
  it("accepts a valid setup payload", () => {
    const parsed = setupSchema.parse(validSetup);
    expect(parsed.transactionVolume).toBe(1000);
    expect(parsed.averageTransactionValue).toBe("15000");
  });

  it("rejects negative and non-integer volume", () => {
    expect(setupSchema.safeParse({ ...validSetup, transactionVolume: "-1" }).success).toBe(false);
    expect(setupSchema.safeParse({ ...validSetup, transactionVolume: "1.5" }).success).toBe(false);
  });

  it("rejects invalid business type and too many decimals", () => {
    expect(setupSchema.safeParse({ ...validSetup, businessType: "crypto" }).success).toBe(false);
    expect(
      setupSchema.safeParse({ ...validSetup, fixedCost: "100.999" }).success,
    ).toBe(false);
  });

  it("requires a scenario name", () => {
    expect(scenarioSchema.safeParse({ ...validSetup, name: "  " }).success).toBe(false);
    expect(scenarioSchema.safeParse({ ...validSetup, name: "Optimistic" }).success).toBe(true);
  });

  it("validates login credentials", () => {
    expect(loginSchema.safeParse({ email: "not-email", password: "x" }).success).toBe(false);
    expect(loginSchema.safeParse({ email: "andi@example.com", password: "secret123" }).success).toBe(true);
  });
});
