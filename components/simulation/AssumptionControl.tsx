"use client";

import { useI18n } from "@/components/i18n/LanguageProvider";

export function AssumptionControl({
  label,
  name,
  value,
  min = 0,
  max,
  step = 100,
  inputStep = "0.01",
  prefix,
  suffix,
  helper,
  onChange,
}: {
  label: string;
  name: string;
  value: number;
  min?: number;
  max: number;
  step?: number;
  inputStep?: string;
  prefix?: string;
  suffix?: string;
  helper?: string;
  onChange: (value: number) => void;
}) {
  const { t } = useI18n();
  const upper = Math.max(max, min + step, 1);

  return (
    <div className="rounded-xl border border-forest/10 bg-cream-light px-4 py-3">
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={name} className="text-xs font-medium text-forest">
          {label}
        </label>
        {suffix && <span className="shrink-0 text-[11px] text-ink/45">{suffix}</span>}
      </div>

      <div className="mt-2 flex items-center gap-3">
        <div className="relative w-32 shrink-0">
          {prefix && (
            <span className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-xs text-forest/55">
              {prefix}
            </span>
          )}
          <input
            id={name}
            name={name}
            type="number"
            min={min}
            step={inputStep}
            value={value}
            onChange={(event) => {
              const next = Number(event.target.value);
              onChange(Number.isFinite(next) ? Math.max(min, next) : min);
            }}
            className={`w-full rounded-lg border border-forest/20 bg-cream py-1.5 pr-2 text-sm tabular text-ink focus:border-forest focus:outline-none ${
              prefix ? "pl-9" : "pl-2.5"
            }`}
          />
        </div>
        <input
          type="range"
          aria-label={`${label} ${t("slider")}`}
          min={min}
          max={upper}
          step={step}
          value={Math.min(value, upper)}
          onChange={(event) => onChange(Number(event.target.value))}
          className="h-1.5 min-w-0 flex-1 cursor-pointer appearance-none rounded-full bg-forest/15 accent-forest"
        />
      </div>

      <div className="mt-1.5 flex items-center justify-between gap-2 text-[10px] text-ink/45">
        <span>{helper ?? t("Use the slider to explore")}</span>
        <span className="tabular shrink-0">
          {t("max {value}", { value: upper.toLocaleString("id-ID") })}
        </span>
      </div>
    </div>
  );
}
