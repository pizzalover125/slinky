"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

export const STEPS = [
  { href: "/create", label: "Theme" },
  { href: "/create/links", label: "Links" },
  { href: "/create/customize", label: "Customize" },
  { href: "/create/publish", label: "Publish" },
] as const;

export function StepNav() {
  const pathname = usePathname();
  const currentIndex = STEPS.findIndex((s) => s.href === pathname);

  return (
    <nav aria-label="Builder steps">
      <ol className="flex flex-wrap items-center gap-2">
        {STEPS.map((step, i) => {
          const isCurrent = i === currentIndex;
          const isDone = currentIndex > -1 && i < currentIndex;

          return (
            <li key={step.href}>
              <Link
                href={step.href}
                aria-current={isCurrent ? "step" : undefined}
                className={cn(
                  "flex items-center gap-2 border-[3px] border-ink px-3 py-1.5 text-xs font-bold uppercase tracking-widest shadow-brut-sm brut-press",
                  isCurrent && "bg-hot text-white",
                  isDone && "bg-mint text-ink",
                  !isCurrent && !isDone && "bg-white text-ink",
                )}
              >
                <span className="tabular-nums opacity-60">{i + 1}</span>
                {step.label}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** Next/back pair rendered at the bottom of each step. */
export function StepFooter({
  back,
  next,
  nextLabel = "Next",
  nextDisabled = false,
}: {
  back?: string;
  next?: string;
  nextLabel?: string;
  nextDisabled?: boolean;
}) {
  return (
    <div className="mt-10 flex items-center justify-between gap-4 border-t-[3px] border-ink pt-6">
      {back ? (
        <Link
          href={back}
          className="border-[3px] border-ink bg-white px-5 py-2.5 text-base font-bold uppercase tracking-tight shadow-brut brut-press"
        >
          ← Back
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={next}
          aria-disabled={nextDisabled}
          tabIndex={nextDisabled ? -1 : undefined}
          className={cn(
            "border-[3px] border-ink bg-hot px-5 py-2.5 text-base font-bold uppercase tracking-tight text-white shadow-brut brut-press",
            nextDisabled && "pointer-events-none opacity-50",
          )}
        >
          {nextLabel} →
        </Link>
      ) : (
        <span />
      )}
    </div>
  );
}
