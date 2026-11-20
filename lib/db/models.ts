import type { BusinessType, Period } from "@/lib/simulation/types";

export interface BusinessRow {
  id: string;
  user_id: string;
  name: string;
  business_type: BusinessType;
  created_at: Date;
  updated_at: Date;
}

export interface SimulationRow {
  id: string;
  business_id: string;
  user_id: string;
  name: string;
  period: Period;
  created_at: Date;
  updated_at: Date;
}

export interface ScenarioRow {
  id: string;
  simulation_id: string;
  user_id: string;
  name: string;
  average_transaction_value: string;
  variable_cost_per_transaction: string;
  fixed_cost: string;
  transaction_volume: number;
  created_at: Date;
  updated_at: Date;
}

export interface SimulationSummary extends SimulationRow {
  business_name: string;
  business_type: BusinessType;
  scenario_count: number;
}

export interface SimulationDetail extends SimulationRow {
  business_name: string;
  business_type: BusinessType;
}

export interface ScenarioView {
  id: string;
  name: string;
  assumptions: {
    averageTransactionValue: number;
    variableCostPerTransaction: number;
    fixedCost: number;
    transactionVolume: number;
  };
  createdAt: string;
  updatedAt: string;
}
