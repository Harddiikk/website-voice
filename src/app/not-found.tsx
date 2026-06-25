import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-site flex-col items-center justify-center px-5 text-center">
      <p className="font-display text-gradient-iris text-7xl font-extrabold sm:text-8xl">404</p>
      <h1 className="font-display mt-4 text-2xl font-bold">This pair walked off.</h1>
      <p className="mt-3 max-w-sm text-[var(--text-muted)]">
        The page you&apos;re looking for doesn&apos;t exist — or sold out. Let&apos;s get you back to
        the collection.
      </p>
      <Link href="/products" className="btn-primary mt-8 inline-flex items-center gap-2">
        <ArrowLeft size={17} /> Back to the shop
      </Link>
    </div>
  );
}
