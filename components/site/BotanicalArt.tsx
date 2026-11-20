export function BotanicalArt({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 520 460" role="img" aria-label="Botanical illustration" className={className}>
      <circle cx="265" cy="215" r="185" fill="#F3EBDD" />
      <circle cx="265" cy="215" r="185" fill="none" stroke="#2F4A3A" strokeOpacity="0.12" />
      <circle cx="398" cy="108" r="30" fill="#F47E6A" fillOpacity="0.35" />
      <circle cx="104" cy="312" r="18" fill="#F47E6A" fillOpacity="0.5" />

      <path d="M258 340C245 280 232 220 236 150" fill="none" stroke="#2F4A3A" strokeWidth="4" strokeLinecap="round" />
      <path d="M262 338c17-57 40-103 76-150" fill="none" stroke="#2F4A3A" strokeWidth="4" strokeLinecap="round" />
      <path d="M259 337c-4-53 1-104-10-164" fill="none" stroke="#2F4A3A" strokeWidth="3.5" strokeLinecap="round" />

      <path d="M236 205c-31-5-52-26-57-59 33 3 54 24 57 59Z" fill="#2F4A3A" />
      <path d="M238 246c-34 2-58-14-70-45 35-5 60 11 70 45Z" fill="#6E8A77" />
      <path d="M236 169c25-18 32-43 25-74-27 16-34 43-25 74Z" fill="#2F4A3A" />
      <path d="M286 238c11-33 33-51 68-54-8 35-30 54-68 54Z" fill="#6E8A77" />
      <path d="M318 196c7-31 26-50 60-55-5 34-24 53-60 55Z" fill="#2F4A3A" />
      <path d="M249 230c20-24 22-49 10-77-22 21-25 47-10 77Z" fill="#F47E6A" fillOpacity="0.85" />
      <path d="M264 286c-25-14-36-34-32-62 27 12 39 32 32 62Z" fill="#F47E6A" fillOpacity="0.7" />

      <path d="M182 330h156l-18 92H200l-18-92Z" fill="#2F4A3A" />
      <path d="M174 322h172v18H174z" fill="#22362B" />
      <path d="M232 356c14 7 42 7 56 0" fill="none" stroke="#F3EBDD" strokeOpacity="0.55" strokeWidth="2" strokeLinecap="round" />
      <path d="M214 385h92" stroke="#F47E6A" strokeOpacity="0.75" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
