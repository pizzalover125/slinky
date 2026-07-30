import { Logo } from "@/components/logo";
import { Chip } from "@/components/ui/card";
import { RsvpForm } from "./rsvp-form";

const REPO_URL = "https://github.com/pizzalover125/slinky";

export default function Home() {
  return (
    <>
      <header className="border-b-[3px] border-ink">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-5 py-4">
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

      <main className="flex flex-1 items-center">
        <div className="mx-auto w-full max-w-3xl px-5 py-20 sm:py-28">
          <Chip tone="lime">Coming soon</Chip>

          <h1 className="mt-6 text-[clamp(2.75rem,8vw,5.5rem)] leading-[0.9]">
            A link in bio
            <br />
            built for you.
          </h1>

          <p className="mt-8 max-w-xl text-xl leading-relaxed text-ink/80">
            A free, open-source, endlessly customizable link-in-bio page for
            small creators.
          </p>

          <div className="mt-12 max-w-xl">
            <RsvpForm />
          </div>
        </div>
      </main>

      <footer className="border-t-[3px] border-ink bg-cream">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-4 px-5 py-8">
          <p className="text-sm text-ink/60">
            Free and open source under the MIT licence.
          </p>
        </div>
      </footer>
    </>
  );
}
