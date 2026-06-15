import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="font-serif text-sm uppercase tracking-widest text-terracotta">
        Lost page
      </p>
      <h1 className="mt-4 font-serif text-4xl text-ink">Not found</h1>
      <p className="mt-4 max-w-sm text-ink/60">
        This page doesn&apos;t exist — maybe the link was mistyped.
      </p>
      <Link href="/" className="btn-primary mt-8">
        Go home
      </Link>
    </main>
  );
}
