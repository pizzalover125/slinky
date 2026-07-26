import { cn } from "@/lib/cn";

export function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "border-[3px] border-ink bg-white shadow-brut-lg",
        className,
      )}
      {...props}
    />
  );
}

/** Chunky inline tag — used for step counters, badges, counts. */
export function Chip({
  className,
  tone = "yellow",
  ...props
}: React.ComponentProps<"span"> & {
  tone?: "yellow" | "hot" | "blue" | "mint" | "lime" | "white";
}) {
  const tones = {
    yellow: "bg-yellow text-ink",
    hot: "bg-hot text-white",
    blue: "bg-blue text-white",
    mint: "bg-mint text-ink",
    lime: "bg-lime text-ink",
    white: "bg-white text-ink",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border-[3px] border-ink px-2.5 py-1 text-xs font-bold uppercase tracking-widest shadow-brut-sm",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
