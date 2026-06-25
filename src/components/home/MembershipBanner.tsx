import { Newsletter } from "@/components/layout/Newsletter";
import { FadeUp } from "@/components/ui/Reveal";

const perks = ["Early access to drops", "Members-only colorways", "Free 48h shipping", "Birthday rewards"];

export function MembershipBanner() {
  return (
    <section className="mx-auto max-w-site px-5 py-20 md:px-8">
      <FadeUp>
        <div className="relative overflow-hidden rounded-[2rem] bg-[var(--surface-2)] px-6 py-16 text-center md:px-16 md:py-24">
          <p className="font-tech mb-3 text-xs uppercase tracking-[0.3em] text-[var(--text-subtle)]">
            AURELIA Society
          </p>
          <h2 className="font-display mx-auto max-w-2xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">
            Join the Society. Step ahead of everyone.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[var(--text-muted)]">
            Membership is free. The access is priceless.
          </p>
          <ul className="mx-auto mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-[var(--text-muted)]">
            {perks.map((p) => (
              <li key={p} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                {p}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex justify-center">
            <Newsletter />
          </div>
        </div>
      </FadeUp>
    </section>
  );
}
