import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "gold" | "sale" | "iris";

const variants: Record<BadgeVariant, string> = {
  default: "bg-white/10 text-[var(--text)] border-white/15",
  gold: "bg-[rgba(232,184,115,0.12)] text-[var(--gold)] border-[rgba(232,184,115,0.4)]",
  sale: "bg-[rgba(255,111,181,0.14)] text-[var(--magenta)] border-[rgba(255,111,181,0.4)]",
  iris: "bg-[rgba(124,92,255,0.16)] text-[var(--primary-soft)] border-[rgba(124,92,255,0.45)]",
};

/** Maps catalog badge labels to a visual variant. */
function variantFor(label: string): BadgeVariant {
  const l = label.toLowerCase();
  if (["limited", "pro"].includes(l)) return "gold";
  if (["sale", "drop"].includes(l)) return "sale";
  if (["new"].includes(l)) return "iris";
  return "default";
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
        "font-tech inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider backdrop-blur",
        variants[resolved],
        className,
      )}
    >
      {children}
    </span>
  );
}
