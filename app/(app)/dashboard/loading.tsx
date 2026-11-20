export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="h-4 w-24 animate-pulse rounded bg-forest/10" />
      <div className="mt-6 h-12 w-80 animate-pulse rounded bg-forest/10" />
      <div className="mt-4 h-4 w-64 animate-pulse rounded bg-forest/10" />
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((index) => (
          <div key={index} className="h-28 animate-pulse rounded-2xl border border-forest/10 bg-cream-light" />
        ))}
      </div>
      <div className="mt-10 space-y-3">
        {[0, 1].map((index) => (
          <div key={index} className="h-24 animate-pulse rounded-2xl border border-forest/10 bg-cream-light" />
        ))}
      </div>
    </div>
  );
}
