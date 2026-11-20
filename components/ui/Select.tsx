import type { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  helper?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, helper, error, options, id, name, className = "", ...props }: SelectProps) {
  const selectId = id ?? name;

  return (
    <div className="space-y-1.5">
      <label htmlFor={selectId} className="block text-sm font-medium text-forest">
        {label}
      </label>
      <select
        id={selectId}
        name={name}
        aria-invalid={error ? true : undefined}
        className={`w-full appearance-none rounded-xl border bg-cream-light px-3.5 py-2.5 text-sm text-ink transition-colors focus:border-forest focus:outline-none ${
          error ? "border-coral" : "border-forest/20"
        } ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <p className="text-xs text-coral-deep">{error}</p>
      ) : helper ? (
        <p className="text-xs text-ink/55">{helper}</p>
      ) : null}
    </div>
  );
}
