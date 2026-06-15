import Link from "next/link";

interface PageHeaderProps {
  backHref?: string;
  backLabel?: string;
  title?: string;
  subtitle?: string;
}

export function PageHeader({
  backHref,
  backLabel = "Back",
  title,
  subtitle,
}: PageHeaderProps) {
  return (
    <header className="mb-10">
      {backHref && (
        <Link
          href={backHref}
          className="mb-6 inline-flex items-center gap-1 text-sm text-ink/50 transition-colors hover:text-terracotta"
        >
          ← {backLabel}
        </Link>
      )}
      {title && (
        <h1 className="font-serif text-3xl text-ink sm:text-4xl">{title}</h1>
      )}
      {subtitle && (
        <p className="mt-3 max-w-xl text-balance text-ink/60">{subtitle}</p>
      )}
    </header>
  );
}
