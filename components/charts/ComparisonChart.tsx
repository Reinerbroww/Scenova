"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { compactIDR, formatIDR } from "@/lib/simulation/format";
import { calculate } from "@/lib/simulation/calculate";
import type { ScenarioView } from "@/lib/db/models";

export function ComparisonChart({ scenarios }: { scenarios: ScenarioView[] }) {
  const { t } = useI18n();
  const revenue = t("Revenue");
  const totalCost = t("Total cost");
  const profit = t("Operating profit");

  const data = scenarios.map((scenario) => {
    const result = calculate(scenario.assumptions);
    return {
      name: scenario.name,
      [revenue]: result.revenue,
      [totalCost]: result.totalCost,
      [profit]: result.operatingProfit,
    };
  });

  return (
    <div className="h-80 w-full" aria-label={t("Scenario comparison chart")}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 8 }} barGap={4}>
          <CartesianGrid stroke="#2F4A3A" strokeOpacity={0.12} vertical={false} />
          <XAxis dataKey="name" tick={{ fill: "#1E2D24", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis
            tickFormatter={(value) => compactIDR(Number(value))}
            tick={{ fill: "#1E2D24", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={72}
          />
          <Tooltip
            formatter={(value) => [formatIDR(Number(value ?? 0)), t("Amount")]}
            contentStyle={{ borderRadius: 12, border: "1px solid #2F4A3A22", background: "#FBF7F0" }}
          />
          <Legend wrapperStyle={{ fontSize: 12, color: "#1E2D24" }} />
          <Bar dataKey={revenue} fill="#2F4A3A" radius={[6, 6, 0, 0]} maxBarSize={28} />
          <Bar dataKey={totalCost} fill="#6E8A77" radius={[6, 6, 0, 0]} maxBarSize={28} />
          <Bar dataKey={profit} fill="#F47E6A" radius={[6, 6, 0, 0]} maxBarSize={28} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
