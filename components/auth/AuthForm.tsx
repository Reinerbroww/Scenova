"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { loginSchema, registerSchema } from "@/lib/simulation/validate";

type Mode = "login" | "register";

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const { t } = useI18n();
  const [values, setValues] = useState({ name: "", email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isRegister = mode === "register";

  function update(field: keyof typeof values, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: "" }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setFieldErrors({});

    const parsed = isRegister
      ? registerSchema.safeParse(values)
      : loginSchema.safeParse({ email: values.email, password: values.password });

    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const field = String(issue.path[0] ?? "form");
        errors[field] ??= t(issue.message);
      }
      setFieldErrors(errors);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const payload = (await response.json()) as {
        data?: unknown;
        error?: string;
        details?: { path: string; message: string }[];
      };

      if (!response.ok) {
        if (payload.details?.length) {
          const errors: Record<string, string> = {};
          for (const detail of payload.details) {
            errors[detail.path] ??= t(detail.message);
          }
          setFieldErrors(errors);
        }
        setFormError(t(payload.error ?? "Unable to continue. Please try again."));
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } catch {
      setFormError(t("Network error. Please check your connection and try again."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <p className="text-xs font-semibold tracking-[0.25em] text-coral-deep uppercase">
        {t(isRegister ? "Create your account" : "Welcome back")}
      </p>
      <h1 className="mt-3 font-serif text-4xl text-forest sm:text-5xl">
        {t(isRegister ? "Start exploring." : "Welcome back.")}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-ink/65">
        {t(
          isRegister
            ? "Save scenarios and compare business possibilities in one calm workspace."
            : "Continue exploring your scenarios and saved assumptions.",
        )}
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4" noValidate>
        {formError && <Alert variant="error">{formError}</Alert>}

        {isRegister && (
          <Input
            label={t("Full name")}
            name="name"
            autoComplete="name"
            placeholder="Andi Pratama"
            value={values.name}
            onChange={(event) => update("name", event.target.value)}
            error={fieldErrors.name}
            disabled={loading}
          />
        )}

        <Input
          label={t("Email address")}
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={values.email}
          onChange={(event) => update("email", event.target.value)}
          error={fieldErrors.email}
          disabled={loading}
        />

        <Input
          label={t("Password")}
          name="password"
          type="password"
          autoComplete={isRegister ? "new-password" : "current-password"}
          placeholder={t("At least 8 characters")}
          value={values.password}
          onChange={(event) => update("password", event.target.value)}
          error={fieldErrors.password}
          helper={isRegister ? t("Use at least 8 characters.") : undefined}
          disabled={loading}
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {t(loading ? "Please wait…" : isRegister ? "Create account" : "Sign in")}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink/65">
        {t(isRegister ? "Already have an account? " : "Don't have an account? ")}
        <Link
          href={isRegister ? "/login" : "/register"}
          className="font-medium text-forest underline underline-offset-4 hover:text-coral-deep"
        >
          {t(isRegister ? "Sign in" : "Create account")}
        </Link>
      </p>
    </div>
  );
}
