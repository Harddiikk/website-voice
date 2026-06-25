import { cn } from "@/lib/utils";

type BadgeVariant = "soft" | "solid";

const variants: Record<BadgeVariant, string> = {
  soft: "bg-black/[0.06] text-[var(--text-muted)] border-black/10",
  solid: "bg-[var(--primary)] text-white border-transparent",
};

/** Emphasis labels render solid black; everything else is a soft gray chip. */
function variantFor(label: string): BadgeVariant {
  const l = label.toLowerCase();
  if (["new", "limited", "pro", "drop"].includes(l)) return "solid";
  return "soft";
}

export function Badge({
  children,
  variant,
  className,
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  const resolved = variant ?? variantFor(String(children));
  return (
    <span
      className={cn(
        "font-tech inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider",
        variants[resolved],
        className,
      )}
    >
      {children}
    </span>
  );
}
