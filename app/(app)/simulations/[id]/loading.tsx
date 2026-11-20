export default function SimulationLoading() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="h-3 w-32 animate-pulse rounded bg-forest/10" />
      <div className="mt-5 h-12 w-72 animate-pulse rounded bg-forest/10" />
      <div className="mt-3 h-4 w-56 animate-pulse rounded bg-forest/10" />
      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
        <div className="h-[720px] animate-pulse rounded-2xl border border-forest/10 bg-cream-light" />
        <div className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2, 3, 4, 5, 6].map((index) => (
              <div key={index} className="h-28 animate-pulse rounded-2xl border border-forest/10 bg-cream-light" />
            ))}
          </div>
          <div className="h-96 animate-pulse rounded-2xl border border-forest/10 bg-cream-light" />
        </div>
      </div>
    </div>
  );
}
