"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { Button } from "@/components/ui/Button";

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  confirmLabel,
  onConfirm,
  loading = false,
  danger = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  confirmLabel?: string;
  onConfirm: () => void;
  loading?: boolean;
  danger?: boolean;
}) {
  const { t } = useI18n();
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label={t("Close dialog")}
        className="absolute inset-0 cursor-default bg-forest/45 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative w-full max-w-md rounded-2xl border border-forest/10 bg-cream-light p-6 shadow-xl"
      >
        <h2 className="font-serif text-2xl text-forest">{title}</h2>
        {description && <p className="mt-2 text-sm leading-relaxed text-ink/70">{description}</p>}
        {children && <div className="mt-4">{children}</div>}
        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
            {t("Cancel")}
          </Button>
          <Button
            type="button"
            variant={danger ? "danger" : "primary"}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? t("Working…") : (confirmLabel ?? t("Confirm"))}
          </Button>
        </div>
      </div>
    </div>
  );
}
