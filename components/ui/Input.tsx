import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helper?: string;
  error?: string;
  prefix?: string;
  suffix?: string;
}

export function Input({ label, helper, error, prefix, suffix, id, name, className = "", ...props }: InputProps) {
  const inputId = id ?? name;

  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="block text-sm font-medium text-forest">
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-sm text-forest/70">
            {prefix}
          </span>
        )}
        <input
          id={inputId}
          name={name}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${inputId}-error` : helper ? `${inputId}-helper` : undefined}
          className={`w-full rounded-xl border bg-cream-light px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/35 transition-colors focus:border-forest focus:outline-none ${
            error ? "border-coral" : "border-forest/20"
          } ${prefix ? "pl-12" : ""} ${suffix ? "pr-14" : ""} ${className}`}
          {...props}
        />
        {suffix && (
          <span className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-xs text-forest/60">
            {suffix}
          </span>
        )}
      </div>
      {error ? (
        <p id={`${inputId}-error`} className="text-xs text-coral-deep">
          {error}
        </p>
      ) : helper ? (
        <p id={`${inputId}-helper`} className="text-xs text-ink/55">
          {helper}
        </p>
      ) : null}
    </div>
  );
}
