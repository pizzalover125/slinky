import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { ThemeStrip } from "@/components/theme-strip";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/card";

const REPO_URL = "https://github.com/pizzalover125/slinky";

const FEATURES = [
  {
    tone: "yellow" as const,
    title: "Unlimited customization",
    body: "Accent colours, borders, and backgrounds. All free, no paywall.",
  },
  {
    tone: "hot" as const,
    title: "Up to 3 pages",
    body: "One account gets you three separate pages.",
  },
  {
    tone: "blue" as const,
    title: "Click counts",
    body: "See how many times each link gets clicked.",
  },
  {
    tone: "lime" as const,
    title: "Genuinely open source",
    body: "MIT licensed on GitHub. Read the code any time.",
  },
  {
    tone: "mint" as const,
    title: "Drag to reorder",
    body: "Drag links to reorder them, or hide one without deleting it.",
  },
  {
    tone: "white" as const,
    title: "Start signed out",
    body: "Build and preview your page before you sign in.",
  },
];

export const metadata: Metadata = {
  title: "Demo",
  // The demo isn't linked from the landing page; keep it out of search results
  // so the only way in is the direct URL.
  robots: { index: false, follow: false },
};

export default function Demo() {
  return (
    <>
      <header className="border-b-[3px] border-ink">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <Link href="/demo">
            <Logo />
          </Link>
          <nav className="flex items-center gap-3">
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="hidden text-sm font-bold uppercase tracking-widest underline underline-offset-4 hover:text-hot sm:inline"
            >
              GitHub
            </a>
            <Link
              href="/login"
              className="border-[3px] border-ink bg-white px-4 py-2 text-sm font-bold uppercase tracking-widest shadow-brut-sm brut-press"
            >
              Sign in
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="border-b-[3px] border-ink">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
            <Chip tone="lime">MIT licensed · free forever</Chip>

            <h1 className="mt-6 max-w-4xl text-[clamp(3rem,9vw,7rem)] leading-[0.88]">
              A link in bio
              <br />
              built for you.
            </h1>

            <p className="mt-8 max-w-xl text-xl leading-relaxed text-ink/80">
              An open-source link-in-bio page for small creators.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button asChild size="lg">
                <Link href="/create">Build your page →</Link>
              </Button>
              <Button asChild variant="neutral" size="lg">
                <a href={REPO_URL} target="_blank" rel="noreferrer">
                  GitHub →
                </a>
              </Button>
            </div>

            <p className="mt-5 text-sm font-bold uppercase tracking-widest text-ink/50">
              No account needed to start
            </p>
          </div>
        </section>

        <section className="border-b-[3px] border-ink bg-mint">
          <div className="mx-auto max-w-6xl px-5 py-20">
            <div className="max-w-2xl">
              <Chip tone="white">Make it yours</Chip>
              <h2 className="mt-5 text-[clamp(2.25rem,5vw,3.75rem)]">
                No two pages look the same.
              </h2>
              <p className="mt-5 text-lg text-ink/80">
                Start from a theme, then set your own accent, border, and
                background. Every color is yours to change, so the combinations
                are endless.
              </p>
            </div>

            <div className="mt-14">
              <ThemeStrip />
            </div>
          </div>
        </section>

        <section className="border-b-[3px] border-ink">
          <div className="mx-auto max-w-6xl px-5 py-20">
            <h2 className="max-w-2xl text-[clamp(2.25rem,5vw,3.75rem)]">
              What you get for nothing.
            </h2>

            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((feature) => (
                <li
                  key={feature.title}
                  className="border-[3px] border-ink bg-white p-6 shadow-brut"
                >
                  <Chip tone={feature.tone}>&nbsp;</Chip>
                  <h3 className="mt-4 text-2xl">{feature.title}</h3>
                  <p className="mt-3 text-ink/70">{feature.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-b-[3px] border-ink bg-hot text-white">
          <div className="mx-auto max-w-6xl px-5 py-24 text-center">
            <h2 className="text-[clamp(2.5rem,7vw,5rem)] leading-[0.9]">
              Two minutes.
              <br />
              No sign-up wall.
            </h2>
            <Button asChild size="lg" variant="secondary" className="mt-10">
              <Link href="/create">Start building →</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-cream">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-5 py-10">
          <Logo />
          <p className="text-sm text-ink/60">
            Free and open source under the MIT licence.
          </p>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-bold uppercase tracking-widest underline underline-offset-4 hover:text-hot"
          >
            GitHub ↗
          </a>
        </div>
      </footer>
    </>
  );
}
