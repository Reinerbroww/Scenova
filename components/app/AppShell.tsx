"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { Logo } from "@/components/site/Logo";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/simulations/new", label: "New Simulation" },
];

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {open ? <path d="M12 5 7 10l5 5" /> : <path d="m8 5 5 5-5 5" />}
    </svg>
  );
}

export function AppShell({
  user,
  children,
}: {
  user: { name: string; email: string };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  function toggleSidebar() {
    setSidebarOpen((open) => !open);
  }

  async function signOut() {
    setSigningOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.replace("/login");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  }

  const navigation = (
    <nav className="space-y-1" aria-label={t("Application navigation")}>
      {links.map((link) => {
        const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            className={`block rounded-xl px-4 py-2.5 text-sm transition-colors ${
              active
                ? "bg-cream/15 font-medium text-cream"
                : "text-cream/70 hover:bg-cream/10 hover:text-cream"
            }`}
          >
            {t(link.label)}
          </Link>
        );
      })}
    </nav>
  );

  const account = (
    <div className="border-t border-cream/15 pt-5">
      <p className="truncate text-sm font-medium text-cream">{user.name}</p>
      <p className="truncate text-xs text-cream/55">{user.email}</p>
      <button
        type="button"
        onClick={signOut}
        disabled={signingOut}
        className="mt-4 w-full rounded-xl border border-cream/20 px-4 py-2 text-left text-sm text-cream/80 transition-colors hover:bg-cream/10 disabled:opacity-50"
      >
        {signingOut ? t("Signing out…") : t("Sign out")}
      </button>
    </div>
  );

  const toggleButton = (
    <button
      type="button"
      onClick={toggleSidebar}
      aria-label={sidebarOpen ? t("Close sidebar") : t("Open sidebar")}
      aria-expanded={sidebarOpen}
      title={sidebarOpen ? t("Close sidebar") : t("Open sidebar")}
      className="rounded-lg border border-cream/20 p-1.5 text-cream/70 transition-colors hover:bg-cream/10 hover:text-cream"
    >
      <Chevron open={sidebarOpen} />
    </button>
  );

  return (
    <div className="flex min-h-screen bg-cream">
      <aside
        className={`hidden shrink-0 flex-col justify-between bg-forest py-7 transition-[width] duration-200 ease-out lg:flex ${
          sidebarOpen ? "w-64 px-5" : "w-16 px-3"
        }`}
      >
        {sidebarOpen ? (
          <>
            <div>
              <div className="flex items-center justify-between gap-2">
                <Logo href="/dashboard" tone="light" />
                {toggleButton}
              </div>
              <div className="mt-4">
                <LanguageSwitcher tone="light" className="w-full justify-center" />
              </div>
              <div className="mt-10">{navigation}</div>
            </div>
            {account}
          </>
        ) : (
          <div className="flex flex-col items-center gap-5">
            <Logo href="/dashboard" tone="light" markOnly />
            {toggleButton}
          </div>
        )}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-forest/10 bg-cream/95 px-5 py-4 backdrop-blur sm:px-8 lg:hidden">
          <Logo href="/dashboard" />
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <button
              type="button"
              aria-label={menuOpen ? t("Close menu") : t("Open menu")}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
              className="rounded-xl border border-forest/20 px-4 py-2 text-sm text-forest"
            >
              {menuOpen ? t("Close") : t("Menu")}
            </button>
          </div>
        </header>

        {menuOpen && (
          <button
            type="button"
            aria-label={t("Close menu")}
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 z-20 cursor-default bg-forest/35 lg:hidden"
          />
        )}

        <div
          className={`relative z-30 border-b border-forest/10 bg-forest px-5 py-5 text-cream lg:hidden ${
            menuOpen ? "block" : "hidden"
          }`}
        >
          {navigation}
          <div className="mt-5">{account}</div>
        </div>

        <main className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-12 lg:py-12">{children}</main>
      </div>
    </div>
  );
}
