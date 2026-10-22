import Link from "next/link";

export default function FinalReveal() {
  return (
    <div data-final className="invisible absolute inset-0 flex items-end opacity-0 md:items-center">
      <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-navy-deep/80 via-navy-deep/35 to-transparent" />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-navy-deep/70 to-transparent md:hidden"
      />
      <div className="container-luxe relative pb-[calc(env(safe-area-inset-bottom,0px)+7rem)] md:pb-0">
        <p data-final-item className="eyebrow mb-6 flex items-center gap-3 text-gold">
          <span>06</span>
          <span aria-hidden className="h-px w-8 bg-current" />
          <span>The finished home</span>
        </p>
        <h2 data-final-item className="gold-foil max-w-3xl font-serif text-display">
          Your Vision. <em className="text-gold-light">Our Craft.</em>
        </h2>
        <p data-final-item className="mt-8 max-w-lg text-base leading-relaxed text-white/75 md:text-lg">
          From the first architectural line to the final finishing detail, we bring thoughtfully designed spaces to life.
        </p>
        <div data-final-item className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/contact#enquiry"
            className="inline-flex min-h-12 w-full items-center justify-center gap-3 sm:w-auto bg-gold px-7 text-[0.75rem] uppercase tracking-[0.2em] text-navy-deep transition-colors hover:bg-white"
          >
            Start Your Project <span aria-hidden>→</span>
          </Link>
          <Link
            href="/projects"
            className="inline-flex min-h-12 w-full items-center justify-center gap-3 sm:w-auto border border-white/40 px-7 text-[0.75rem] uppercase tracking-[0.2em] text-white transition-colors hover:border-gold hover:text-gold"
          >
            Explore Our Work
          </Link>
        </div>
      </div>
    </div>
  );
}
