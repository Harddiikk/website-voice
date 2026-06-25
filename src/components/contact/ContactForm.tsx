"use client";

import { Check, Send } from "lucide-react";
import { useState } from "react";

const subjects = ["General enquiry", "Order support", "Returns", "Partnerships", "Press"];

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: subjects[0], message: "" });

  function update(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSent(true);
  }

  if (sent) {
    return (
      <div className="glass flex min-h-[420px] flex-col items-center justify-center gap-4 p-10 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-[rgba(52,211,153,0.15)] text-[var(--success)]">
          <Check size={28} />
        </div>
        <h3 className="font-display text-2xl">Message sent</h3>
        <p className="max-w-xs text-[var(--text-muted)]">
          Thanks, {form.name.split(" ")[0] || "friend"}. Our concierge team replies within 24 hours.
        </p>
        <button
          onClick={() => {
            setSent(false);
            setForm({ name: "", email: "", subject: subjects[0], message: "" });
          }}
          className="btn-glass mt-2 text-sm"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="glass flex flex-col gap-5 p-7 md:p-9">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name">
          <input
            required
            value={form.name}
            onChange={update("name")}
            className="field-input"
            placeholder="Your name"
          />
        </Field>
        <Field label="Email">
          <input
            required
            type="email"
            value={form.email}
            onChange={update("email")}
            className="field-input"
            placeholder="you@email.com"
          />
        </Field>
      </div>
      <Field label="Subject">
        <select value={form.subject} onChange={update("subject")} className="field-input">
          {subjects.map((s) => (
            <option key={s} className="bg-[var(--surface-2)]">
              {s}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Message">
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={update("message")}
          className="field-input resize-none"
          placeholder="How can we help?"
        />
      </Field>
      <button type="submit" className="btn-primary mt-1 inline-flex items-center justify-center gap-2">
        <Send size={16} /> Send message
      </button>
      <p className="text-center text-xs text-[var(--text-subtle)]">We reply within 24 hours.</p>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs uppercase tracking-wider text-[var(--text-subtle)]">{label}</span>
      {children}
    </label>
  );
}
