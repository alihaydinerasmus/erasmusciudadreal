export default function Loading() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 dark:bg-dark-bg"
      aria-busy="true"
      aria-label="Loading"
    >
      <h1 className="journal-fade-in font-serif text-[32px] font-normal text-ink dark:text-dark-text">
        Ciudad Real
      </h1>
      <p className="journal-fade-in-delay mt-5 text-[11px] uppercase tracking-[0.25em] text-ink/40 dark:text-dark-muted">
        ERASMUS • UCLM • 2025–26
      </p>
      <span
        className="journal-fade-in-delay journal-pulse mt-8 inline-block h-2 w-2 rounded-full bg-terracotta dark:bg-terracotta-light"
        aria-hidden="true"
      />
    </div>
  );
}
