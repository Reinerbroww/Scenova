import { toMinorUnits } from "./calculate";

const currency = new Intl.NumberFormat("id-ID", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const decimal = new Intl.NumberFormat("id-ID", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatIDR(value: number | string): string {
  const raw = typeof value === "string" ? value.trim() : value.toFixed(2);
  const negative = raw.startsWith("-");
  let minor: bigint;

  try {
    minor = toMinorUnits(negative ? raw.slice(1) : raw);
  } catch {
    minor = 0n;
  }

  const absolute = minor;
  const whole = absolute / 100n;
  const fraction = absolute % 100n;
  const grouped = currency.format(Number(whole));

  const fractionText = fraction === 0n ? "" : `,${fraction.toString().padStart(2, "0")}`;
  return `${negative ? "-" : ""}Rp ${grouped}${fractionText}`;
}

export function formatPercent(value: number | null): string {
  return value === null ? "—" : `${decimal.format(value)}%`;
}

export function formatCount(value: number | null): string {
  return value === null ? "—" : new Intl.NumberFormat("id-ID").format(value);
}

export function formatDate(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatInputNumber(value: number): string {
  return value.toLocaleString("id-ID", { maximumFractionDigits: 2 });
}

export function compactIDR(value: number): string {
  const absolute = Math.abs(value);
  if (absolute >= 1_000_000_000) return `Rp ${(value / 1_000_000_000).toFixed(1)}M`;
  if (absolute >= 1_000_000) return `Rp ${(value / 1_000_000).toFixed(1)}jt`;
  if (absolute >= 1_000) return `Rp ${(value / 1_000).toFixed(0)}rb`;
  return `Rp ${value.toFixed(0)}`;
}
