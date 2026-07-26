import { cn } from "@/lib/cn";

const FIELD_BASE =
  "w-full border-[3px] border-ink bg-white px-4 py-2.5 text-base text-ink shadow-brut-sm " +
  "placeholder:text-ink/40 focus:shadow-brut focus:outline-none " +
  "disabled:cursor-not-allowed disabled:bg-ink/5 aria-invalid:bg-hot/10";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return <input className={cn(FIELD_BASE, className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea className={cn(FIELD_BASE, "resize-y", className)} {...props} />
  );
}

export function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      className={cn(
        "mb-1.5 block text-xs font-bold uppercase tracking-widest",
        className,
      )}
      {...props}
    />
  );
}

export function FieldError({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return (
    <p className="mt-1.5 text-sm font-bold text-hot" role="alert">
      {children}
    </p>
  );
}
