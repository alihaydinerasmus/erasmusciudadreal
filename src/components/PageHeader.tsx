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
    <header className="mb-8">
      {backHref && (
        <Link href={backHref} className="back-link">
          ← {backLabel}
        </Link>
      )}
      {title && <h1 className="page-title">{title}</h1>}
      {subtitle && (
        <p className="body-text mt-3 max-w-xl text-balance">{subtitle}</p>
      )}
    </header>
  );
}
