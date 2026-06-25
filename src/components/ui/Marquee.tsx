import { cn } from "@/lib/utils";

/** Seamless infinite marquee — content is duplicated so the loop is continuous. */
export function Marquee({ items, className }: { items: string[]; className?: string }) {
  const row = [...items, ...items];
  return (
    <div className={cn("relative flex overflow-hidden border-y border-black/[0.08] py-4", className)}>
      <div className="animate-marquee flex shrink-0 items-center gap-10 pr-10">
        {row.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-3 whitespace-nowrap text-sm uppercase tracking-[0.2em] text-[var(--text-muted)]"
          >
            <span className="h-1 w-1 rounded-full bg-[var(--primary)]" />
            {item}
          </span>
        ))}
      </div>
      <div
        aria-hidden
        className="animate-marquee flex shrink-0 items-center gap-10 pr-10"
      >
        {row.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-3 whitespace-nowrap text-sm uppercase tracking-[0.2em] text-[var(--text-muted)]"
          >
            <span className="h-1 w-1 rounded-full bg-[var(--primary)]" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
