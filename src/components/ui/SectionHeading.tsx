import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FadeUp } from "@/components/ui/Reveal";

export function SectionHeading({
  kicker,
  title,
  href,
  hrefLabel = "View all",
}: {
  kicker?: string;
  title: string;
  href?: string;
  hrefLabel?: string;
}) {
  return (
    <FadeUp className="mb-10 flex items-end justify-between gap-6">
      <div>
        {kicker && (
          <p className="font-tech mb-3 text-xs uppercase tracking-[0.3em] text-[var(--primary-soft)]">
            {kicker}
          </p>
        )}
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">{title}</h2>
      </div>
      {href && (
        <Link
          href={href}
          className="group hidden shrink-0 items-center gap-1.5 text-sm text-[var(--text-muted)] transition hover:text-[var(--text)] sm:flex"
        >
          {hrefLabel}
          <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      )}
    </FadeUp>
  );
}
