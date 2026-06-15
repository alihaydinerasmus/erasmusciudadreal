import Link from "next/link";
import { GroupLinkForm } from "@/components/GroupLinkForm";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-4 font-serif text-sm uppercase tracking-[0.25em] text-terracotta">
          A memory album
        </p>

        <h1 className="font-serif text-5xl leading-tight text-ink sm:text-6xl">
          Ciudad Real &apos;24–25
        </h1>

        <p className="mx-auto mt-8 max-w-md text-balance text-lg leading-relaxed text-ink/60">
          A place to remember where everyone ended up — scattered across maps
          and time zones, still connected by one semester in Castilla-La
          Mancha.
        </p>

        <div className="my-12 h-px w-16 bg-terracotta/30 mx-auto" aria-hidden="true" />

        <GroupLinkForm />

        <p className="mt-8 text-sm text-ink/40">
          Have a group link? Paste it above.{" "}
          <Link
            href="/group/ciudad-real-2425"
            className="text-terracotta underline-offset-2 hover:underline"
          >
            Try the demo
          </Link>
        </p>
      </div>
    </main>
  );
}
