import Link from "next/link";

const TAGLINES = [
  { flag: "🇹🇷", text: "Geçti ama bitmedi." },
  { flag: "🇬🇧", text: "It ended. But not really." },
  { flag: "🇪🇸", text: "Se acabó. Pero no del todo." },
  { flag: "🇮🇹", text: "È finita. Ma non del tutto." },
  { flag: "🇵🇹", text: "Acabou. Mas não de verdade." },
] as const;

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#FAF7F2] px-6 py-20">
      <div className="mx-auto flex w-full max-w-lg flex-col items-center text-center">
        <p className="font-sans text-[0.65rem] font-light uppercase tracking-[0.35em] text-ink/45">
          Erasmus • UCLM • 2025–26
        </p>

        <h1 className="mt-6 font-serif text-6xl font-normal leading-none tracking-tight text-ink sm:text-7xl">
          Ciudad Real
        </h1>

        <div
          className="my-10 h-px w-24 bg-gradient-to-r from-transparent via-ink/15 to-transparent"
          aria-hidden="true"
        />

        <div className="flex flex-col items-center gap-3">
          {TAGLINES.map((line, index) => (
            <p
              key={line.flag}
              className="font-serif italic leading-snug text-ink transition-none"
              style={{
                fontSize: `${1.125 - index * 0.125}rem`,
                opacity: 0.72 - index * 0.13,
              }}
            >
              <span className="not-italic" aria-hidden="true">
                {line.flag}{" "}
              </span>
              {line.text}
            </p>
          ))}
        </div>

        <div
          className="my-12 h-px w-16 bg-ink/10"
          aria-hidden="true"
        />

        <Link
          href="/group/ciudad-real-2526"
          className="group inline-flex items-center gap-2 font-serif text-lg tracking-wide text-terracotta transition-colors hover:text-terracotta-dark"
        >
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
            →
          </span>
          Enter
        </Link>
      </div>

      <p className="mt-auto pt-16 font-sans text-[0.7rem] font-light tracking-[0.12em] text-ink/35">
        UCLM · Facultad de Letras · Ciudad Real
      </p>
    </main>
  );
}
