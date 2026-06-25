import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { FadeUp } from "@/components/ui/Reveal";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the AURELIA concierge team, or visit our SoHo flagship.",
};

export default function ContactPage() {
  const rows = [
    { icon: MapPin, label: "Flagship", value: SITE.address },
    { icon: Clock, label: "Hours", value: SITE.hours },
    { icon: Phone, label: "Phone", value: SITE.phone },
    { icon: Mail, label: "Email", value: SITE.email },
  ];

  return (
    <div className="mx-auto max-w-site px-5 pt-32 md:px-8">
      <FadeUp className="mb-12 max-w-2xl">
        <p className="font-tech mb-3 text-xs uppercase tracking-[0.3em] text-[var(--primary-soft)]">
          Get in touch
        </p>
        <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Let&apos;s <span className="text-gradient-iris">talk</span>.
        </h1>
        <p className="mt-4 text-[var(--text-muted)]">
          Questions about a fit, an order, or a partnership? Send a note — or just ask the voice
          concierge in the corner and it&apos;ll bring you right here.
        </p>
      </FadeUp>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        {/* info card */}
        <FadeUp>
          <div className="glass flex h-full flex-col gap-6 p-7 md:p-9">
            <h2 className="font-display text-2xl">Concierge</h2>
            <p className="text-sm leading-relaxed text-[var(--text-muted)]">
              Our team is on hand to help with sizing, drops, and anything in between.
            </p>
            <ul className="flex flex-col gap-5">
              {rows.map((r) => (
                <li key={r.label} className="flex items-start gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/5 text-[var(--primary-soft)]">
                    <r.icon size={18} />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[var(--text-subtle)]">{r.label}</p>
                    <p className="mt-0.5 text-[var(--text)]">{r.value}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div
              className="mt-auto h-40 rounded-2xl border border-white/10"
              style={{
                background:
                  "radial-gradient(120% 120% at 30% 20%, rgba(124,92,255,0.25), transparent 55%), linear-gradient(160deg,#14141c,#0a0a0f)",
              }}
            >
              <div className="grid h-full place-items-center text-sm text-[var(--text-subtle)]">
                118 Mercer St · SoHo, NY
              </div>
            </div>
          </div>
        </FadeUp>

        {/* form */}
        <FadeUp delay={0.1}>
          <ContactForm />
        </FadeUp>
      </div>
    </div>
  );
}
