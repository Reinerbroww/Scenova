"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { compactIDR, formatIDR } from "@/lib/simulation/format";
import type { CalculationResult } from "@/lib/simulation/types";

export function FinancialOverviewChart({ result }: { result: CalculationResult }) {
  const { t } = useI18n();
  const data = [
    { name: t("Revenue"), value: result.revenue, color: "#2F4A3A" },
    { name: t("Total cost"), value: result.totalCost, color: "#6E8A77" },
    { name: t("Operating profit"), value: result.operatingProfit, color: "#F47E6A" },
  ];

  return (
    <div className="h-72 w-full" aria-label={t("Financial overview chart")}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
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
          <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={64}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
