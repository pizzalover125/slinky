import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-5 py-20 text-center">
      <Link href="/" aria-label="slinky home" className="mb-10">
        <Logo />
      </Link>

      <p className="font-display text-[clamp(5rem,20vw,11rem)] leading-none text-hot">
        404
      </p>
      <h1 className="mt-4 text-4xl">Nothing lives here.</h1>
      <p className="mt-4 max-w-sm text-lg text-ink/70">
        That page either never existed or its owner took it down.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild size="lg">
          <Link href="/create">Make your own</Link>
        </Button>
        <Button asChild variant="neutral" size="lg">
          <Link href="/">Home</Link>
        </Button>
      </div>
    </main>
  );
}
