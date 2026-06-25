"use client";

import { ArrowRight, Check } from "lucide-react";
import { useState } from "react";

export function Newsletter({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setDone(true);
    setEmail("");
    setTimeout(() => setDone(false), 3500);
  }

  return (
    <form onSubmit={submit} className="relative w-full max-w-md">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="w-full rounded-full border border-black/[0.08] bg-black/[0.03] py-3.5 pl-5 pr-14 text-sm text-[var(--text)] outline-none transition placeholder:text-[var(--text-subtle)] focus:border-[var(--primary)]"
        aria-label="Email address"
      />
      <button
        type="submit"
        className={`absolute right-1.5 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full transition ${
          done ? "bg-[var(--success)]" : "bg-[var(--primary)] hover:opacity-90"
        }`}
        aria-label="Subscribe"
      >
        {done ? <Check size={16} /> : <ArrowRight size={16} />}
      </button>
      {!compact && (
        <p className="mt-3 pl-1 text-xs text-[var(--text-subtle)]">
          {done ? "You're on the list. Welcome to the Society." : "Drops, early access, and members-only releases."}
        </p>
      )}
    </form>
  );
}
