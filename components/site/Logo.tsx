import Link from "next/link";

export function Logo({
  href = "/",
  tone = "dark",
  markOnly = false,
}: {
  href?: string;
  tone?: "dark" | "light";
  markOnly?: boolean;
}) {
  const mark = tone === "light" ? "#F3EBDD" : "#2F4A3A";
  const accent = tone === "light" ? "#F47E6A" : "#F47E6A";

  return (
    <Link href={href} className="group inline-flex items-center gap-2" aria-label="Scenova home">
      <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
        <path
          d="M16 27C9 27 5 22 5 15c0-5 4-9 11-10 7 1 11 5 11 10 0 7-4 12-11 12Z"
          fill={mark}
        />
        <path d="M16 25V9" stroke={tone === "light" ? "#2F4A3A" : "#F3EBDD"} strokeWidth="1.6" strokeLinecap="round" />
        <path d="M16 15c-3-1-5-3-5-6 3 0 5 2 5 6Zm0 5c3-1 5-3 5-6-3 0-5 2-5 6Z" fill={accent} />
      </svg>
      {!markOnly && (
        <span
          className={`font-serif text-xl tracking-tight transition-colors ${
            tone === "light"
              ? "text-cream group-hover:text-coral"
              : "text-forest group-hover:text-forest-deep"
          }`}
        >
          Scenova
        </span>
      )}
    </Link>
  );
}
