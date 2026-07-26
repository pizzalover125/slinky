import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "tertiary" | "neutral" | "ghost";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-hot text-white",
  secondary: "bg-yellow text-ink",
  tertiary: "bg-blue text-white",
  neutral: "bg-white text-ink",
  ghost: "border-transparent bg-transparent text-ink shadow-none",
};

const SIZES: Record<Size, string> = {
  sm: "gap-1.5 px-3 py-1.5 text-sm",
  md: "gap-2 px-5 py-2.5 text-base",
  lg: "gap-2.5 px-7 py-3.5 text-lg",
};

type ButtonProps = React.ComponentProps<"button"> & {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(
        "inline-flex cursor-pointer items-center justify-center border-[3px] border-ink font-bold uppercase tracking-tight",
        "shadow-brut brut-press",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-brut-sm",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    />
  );
}
