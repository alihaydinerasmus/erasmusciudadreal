export default function ProfileLoading() {
  return (
    <main className="page-shell" aria-busy="true" aria-label="Loading profile">
      <header className="mb-8">
        <div className="skeleton-shimmer mb-8 h-4 w-20 rounded-sm opacity-60" />
      </header>

      <div className="mb-8 flex items-start gap-4">
        <div className="skeleton-shimmer h-10 w-10 shrink-0 rounded-sm opacity-80" />
        <div className="flex-1">
          <div className="skeleton-shimmer h-8 w-44 rounded-sm opacity-80" />
          <div className="skeleton-shimmer mt-2 h-4 w-28 rounded-sm opacity-60" />
        </div>
      </div>

      <div className="edit-section">
        <div className="skeleton-shimmer h-5 w-32 rounded-sm opacity-70" />
        <div className="skeleton-shimmer mt-4 h-20 w-full rounded-sm opacity-50" />
      </div>

      <div className="skeleton-shimmer mt-6 h-48 w-full rounded-sm opacity-60" />

      <div className="edit-section mt-2">
        <div className="skeleton-shimmer h-5 w-28 rounded-sm opacity-70" />
        <div className="skeleton-shimmer mt-4 h-16 w-full rounded-sm opacity-50" />
      </div>
    </main>
  );
}
