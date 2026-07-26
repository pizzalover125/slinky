import { cn } from "@/lib/cn";

/** Two interlocked chain links, drawn with heavy strokes to match the wordmark. */
export function LogoMark({
  className,
  ...props
}: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 48 32"
      fill="none"
      aria-hidden="true"
      className={cn("h-7 w-auto", className)}
      {...props}
    >
      <rect
        x="3"
        y="3"
        width="26"
        height="26"
        rx="13"
        stroke="currentColor"
        strokeWidth="6"
      />
      <rect
        x="19"
        y="3"
        width="26"
        height="26"
        rx="13"
        stroke="currentColor"
        strokeWidth="6"
      />
    </svg>
  );
}

export function Logo({
  className,
  markClassName,
}: {
  className?: string;
  markClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark className={markClassName} />
      <span className="font-display text-2xl lowercase tracking-tight">
        slinky
      </span>
    </span>
  );
}
