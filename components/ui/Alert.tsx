import type { ReactNode } from "react";

type Variant = "error" | "success" | "info";

const styles: Record<Variant, string> = {
  error: "border-coral/40 bg-coral/10 text-coral-deep",
  success: "border-forest/25 bg-forest/10 text-forest",
  info: "border-forest/20 bg-cream-light text-forest",
};

export function Alert({
  variant = "info",
  children,
  className = "",
}: {
  variant?: Variant;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div role="status" className={`rounded-xl border px-4 py-3 text-sm ${styles[variant]} ${className}`}>
      {children}
    </div>
  );
}
