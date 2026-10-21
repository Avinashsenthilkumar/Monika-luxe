import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-svh items-center bg-navy-deep text-white">
      <div className="container-luxe">
        <p className="eyebrow mb-6 text-gold">404 — Not on the drawings</p>
        <h1 className="max-w-3xl font-serif text-display">This room hasn&apos;t been built.</h1>
        <p className="mt-8 max-w-md text-white/65">The page you were looking for doesn&apos;t exist or has moved.</p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/"
            className="inline-flex min-h-12 items-center bg-gold px-7 text-[0.75rem] uppercase tracking-[0.2em] text-navy-deep hover:bg-white"
          >
            Back home
          </Link>
          <Link
            href="/projects"
            className="inline-flex min-h-12 items-center border border-line-light px-7 text-[0.75rem] uppercase tracking-[0.2em] hover:border-gold hover:text-gold"
          >
            View projects
          </Link>
        </div>
      </div>
    </section>
  );
}
