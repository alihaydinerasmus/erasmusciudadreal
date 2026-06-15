interface PageShellProps {
  children?: React.ReactNode;
  className?: string;
  centered?: boolean;
}

export function PageShell({
  children,
  className = "",
  centered = false,
}: PageShellProps) {
  return (
    <main
      className={[
        "page-shell",
        centered ? "flex flex-col justify-center" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </main>
  );
}
