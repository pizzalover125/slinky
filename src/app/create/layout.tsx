import Link from "next/link";
import { DraftProvider } from "@/components/builder/draft-provider";
import { Preview } from "@/components/builder/preview";
import { StepNav } from "@/components/builder/step-nav";
import { Logo } from "@/components/logo";

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DraftProvider>
      <header className="border-b-[3px] border-ink bg-cream">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4">
          <Link href="/" aria-label="slinky home">
            <Logo />
          </Link>
          <StepNav />
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start">
          <div className="min-w-0 flex-1">{children}</div>
          <div className="lg:sticky lg:top-10">
            <Preview />
          </div>
        </div>
      </main>
    </DraftProvider>
  );
}
