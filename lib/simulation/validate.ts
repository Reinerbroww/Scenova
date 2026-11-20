import { z } from "zod";

const money = z
  .union([z.string(), z.number()])
  .transform((value) => (typeof value === "number" ? value.toFixed(2) : value.trim()))
  .pipe(
    z
      .string()
      .regex(/^\d{1,12}(\.\d{1,2})?$/, "Enter a non-negative amount with up to 2 decimals"),
  );

const volume = z
  .union([z.string(), z.number()])
  .transform((value) => (typeof value === "string" ? Number(value) : value))
  .pipe(z.number().int().min(0).max(2147483647, "Volume is too large"));

export const setupSchema = z.object({
  simulationName: z.string().trim().min(1, "Simulation name is required").max(120),
  businessName: z.string().trim().min(1, "Business name is required").max(120),
  businessType: z.enum(["product", "service", "other"]),
  period: z.enum(["weekly", "monthly", "yearly"]),
  averageTransactionValue: money,
  variableCostPerTransaction: money,
  fixedCost: money,
  transactionVolume: volume,
});

export const scenarioSchema = z.object({
  name: z.string().trim().min(1, "Scenario name is required").max(80),
  averageTransactionValue: money,
  variableCostPerTransaction: money,
  fixedCost: money,
  transactionVolume: volume,
});

export const assumptionsSchema = z.object({
  averageTransactionValue: money,
  variableCostPerTransaction: money,
  fixedCost: money,
  transactionVolume: volume,
});

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(120),
  email: z.string().trim().email("Enter a valid email address").max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address").max(255),
  password: z.string().min(1, "Password is required").max(128),
});

export type SetupInput = z.infer<typeof setupSchema>;
export type ScenarioInput = z.infer<typeof scenarioSchema>;
export type AssumptionsInput = z.infer<typeof assumptionsSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
