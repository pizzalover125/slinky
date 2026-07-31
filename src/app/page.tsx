import { Logo } from "@/components/logo";
import { Chip } from "@/components/ui/card";
import { ThemeStrip } from "@/components/theme-strip";
import { RsvpForm } from "./rsvp-form";

const REPO_URL = "https://github.com/pizzalover125/slinky";

const FEATURES = [
  {
    tone: "yellow" as const,
    title: "Unlimited customization",
    body: "Accent colours, borders, fonts, and backgrounds — all free, nothing paywalled.",
  },
  {
    tone: "hot" as const,
    title: "Up to 3 pages",
    body: "One account, three separate pages. Keep your projects apart.",
  },
  {
    tone: "blue" as const,
    title: "Click counts",
    body: "See how many times each link gets clicked. No third-party tracker.",
  },
  {
    tone: "lime" as const,
    title: "Genuinely open source",
    body: "MIT licensed on GitHub. Read the code, fork it, or self-host it.",
  },
  {
    tone: "mint" as const,
    title: "Drag to reorder",
    body: "Drag links into the order you want, or hide one without deleting it.",
  },
  {
    tone: "white" as const,
    title: "Start signed out",
    body: "Build and preview a whole page before you make an account.",
  },
];

export default function Home() {
  return (
    <>
      <header className="border-b-[3px] border-ink">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4">
          <Logo />
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-bold uppercase tracking-widest underline underline-offset-4 hover:text-hot"
          >
            GitHub ↗
          </a>
        </div>
      </header>

      <main className="flex-1">
        <section className="border-b-[3px] border-ink">
          <div className="mx-auto w-full max-w-5xl px-5 py-20 sm:py-28">
            <Chip tone="lime">Coming soon</Chip>

            <h1 className="mt-6 text-[clamp(2.75rem,8vw,5.5rem)] leading-[0.9]">
              A link in bio
              <br />
              built for you.
            </h1>

            <p className="mt-8 max-w-xl text-xl leading-relaxed text-ink/80">
              A free, open-source, endlessly customizable link-in-bio page for
              small creators. Slinky isn&rsquo;t open yet — leave your email and
              we&rsquo;ll tell you the day it is.
            </p>

            <div className="mt-12 max-w-xl">
              <RsvpForm />
            </div>

            <p className="mt-5 text-sm font-bold uppercase tracking-widest text-ink/50">
              One email at launch. Nothing else, ever.
            </p>
          </div>
        </section>

        <section className="border-b-[3px] border-ink bg-mint">
          <div className="mx-auto max-w-5xl px-5 py-20">
            <div className="max-w-2xl">
              <Chip tone="white">What it is</Chip>
              <h2 className="mt-5 text-[clamp(2rem,5vw,3.25rem)]">
                One page. Every link. Your look.
              </h2>
              <p className="mt-5 text-lg text-ink/80">
                Slinky gives you a single page to hold everything you&rsquo;d
                otherwise cram into a bio. Start from a theme, then change the
                accent, borders, fonts, and background until it stops looking
                like a template.
              </p>
            </div>

            <div className="mt-14">
              <ThemeStrip />
            </div>
          </div>
        </section>

        <section className="border-b-[3px] border-ink">
          <div className="mx-auto max-w-5xl px-5 py-20">
            <h2 className="max-w-2xl text-[clamp(2rem,5vw,3.25rem)]">
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
          <div className="mx-auto max-w-5xl px-5 py-20">
            <div className="max-w-2xl">
              <h2 className="text-[clamp(2rem,5vw,3.25rem)]">
                Where it&rsquo;s at.
              </h2>
              <p className="mt-5 text-lg text-white/90">
                Slinky is in active development and built in the open. The
                editor, themes, and click counts work today; sign-ups open once
                the hosted version is ready. Every line of it is MIT licensed,
                so you can read along — or run your own copy — right now.
              </p>
              <a
                href={REPO_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex border-[3px] border-ink bg-white px-7 py-3.5 text-lg font-bold uppercase tracking-tight text-ink shadow-brut brut-press"
              >
                Read the code →
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-cream">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-6 px-5 py-10">
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
