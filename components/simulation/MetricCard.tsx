export function MetricCard({
  label,
  value,
  helper,
  accent = false,
  compact = false,
}: {
  label: string;
  value: string;
  helper?: string;
  accent?: boolean;
  compact?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border ${
        compact ? "px-3.5 py-3" : "p-5"
      } ${
        accent ? "border-coral/30 bg-coral/10" : "border-forest/10 bg-cream-light"
      }`}
    >
      <p
        className={`font-medium tracking-wider text-forest/60 uppercase ${
          compact ? "text-[10px]" : "text-xs"
        }`}
      >
        {label}
      </p>
      <p
        className={`tabular mt-1.5 font-medium ${compact ? "text-lg" : "text-2xl"} ${
          accent ? "text-coral-deep" : "text-forest"
        }`}
      >
        {value}
      </p>
      {helper && <p className={`mt-1 text-ink/50 ${compact ? "text-[11px]" : "text-xs"}`}>{helper}</p>}
    </div>
  );
}
