"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navigation } from "@/lib/content";
import { cn } from "@/lib/utils";
import MobileNavigation from "./MobileNavigation";

export default function Header() {
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) => {
    const base = href.split("#")[0] || "/";
    if (href.includes("#")) return false;
    return base === "/" ? pathname === "/" : pathname.startsWith(base);
  };

  return (
    <>
      <a
        href="#main"
        className="fixed left-4 top-4 z-[80] -translate-y-24 bg-gold px-4 py-3 text-sm text-navy-deep transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top,0px)] text-white transition-[background-color,padding,border-color,backdrop-filter] duration-700 ease-[var(--ease-luxe)]",
          compact
            ? "border-b border-line-light bg-navy-deep/95 py-3"
            : "border-b border-transparent bg-gradient-to-b from-navy-deep/60 to-transparent py-4 md:py-8",
        )}
      >
        <div className="container-luxe flex items-center justify-between gap-6">
          <Link href="/" className="group flex items-center gap-3" aria-label="Monika Luxe — home">
            <Image
              src="/brand/monika-luxe-mark.png"
              alt=""
              width={146}
              height={138}
              priority
              className={cn("w-auto transition-[height] duration-700", compact ? "h-9" : "h-10 md:h-12")}
            />
            <span className="flex flex-col leading-none">
              <span className="font-serif text-[1.35rem] tracking-[0.2em] text-gold md:text-[1.5rem]">MONIKA LUXE</span>
              <span className="eyebrow mt-1.5 text-[0.52rem] tracking-[0.3em] text-white/70 transition-colors group-hover:text-gold-light">
                Construction &amp; Interiors
              </span>
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden xl:block">
            <ul className="flex items-center gap-7 xl:gap-9">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className="group relative py-2 text-[0.74rem] uppercase tracking-[0.2em] text-white/80 transition-colors hover:text-white aria-[current=page]:text-white"
                  >
                    {item.label}
                    <span
                      aria-hidden
                      className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-gold transition-transform duration-500 ease-[var(--ease-luxe)] group-hover:scale-x-100 group-aria-[current=page]:scale-x-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/contact#enquiry"
              className="hidden min-h-11 items-center border border-gold/60 px-5 text-[0.7rem] uppercase tracking-[0.2em] text-white transition-colors duration-500 hover:bg-gold hover:text-navy-deep md:inline-flex"
            >
              Book a Consultation
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="flex h-11 w-11 flex-col items-center justify-center gap-[7px] xl:hidden"
            >
              <span className="sr-only">Open menu</span>
              <span aria-hidden className="h-px w-7 bg-white" />
              <span aria-hidden className="h-px w-7 translate-x-1.5 bg-white" />
            </button>
          </div>
        </div>
      </header>
      <MobileNavigation open={open} onClose={() => setOpen(false)} isActive={isActive} />
    </>
  );
}
