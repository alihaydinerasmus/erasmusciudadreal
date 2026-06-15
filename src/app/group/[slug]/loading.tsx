function ProfileCardSkeleton() {
  return (
    <div className="border-b border-ink/10 py-5" aria-hidden="true">
      <div className="skeleton-shimmer h-7 w-7 rounded-sm opacity-80" />
      <div className="skeleton-shimmer mt-3 h-5 w-36 rounded-sm opacity-80" />
      <div className="skeleton-shimmer mt-2 h-4 w-24 rounded-sm opacity-60" />
    </div>
  );
}

export default function GroupLoading() {
  return (
    <main className="page-shell" aria-busy="true" aria-label="Loading group">
      <header className="mb-8">
        <div className="skeleton-shimmer mb-8 h-4 w-16 rounded-sm opacity-60" />
        <div className="skeleton-shimmer h-8 w-48 rounded-sm opacity-80" />
      </header>
      <ul>
        {[0, 1, 2].map((i) => (
          <li key={i}>
            <ProfileCardSkeleton />
          </li>
        ))}
      </ul>
    </main>
  );
}
