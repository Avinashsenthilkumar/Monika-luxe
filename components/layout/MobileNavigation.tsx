"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { company, navigation, whatsappLink } from "@/lib/content";
import { cn } from "@/lib/utils";
import { useLenis } from "./SmoothScroll";

export default function MobileNavigation({
  open,
  onClose,
  isActive,
}: {
  open: boolean;
  onClose: () => void;
  isActive: (href: string) => boolean;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    lenis?.stop();
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panel.current) {
        const focusables = panel.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      lenis?.start();
      previouslyFocused?.focus?.();
    };
  }, [open, onClose, lenis]);

  return (
    <div
      id="mobile-menu"
      ref={panel}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      aria-hidden={!open}
      inert={!open}
      className={cn(
        "fixed inset-0 z-[70] flex flex-col bg-navy-deep text-white transition-[clip-path] duration-700 ease-[var(--ease-luxe)] xl:hidden",
        open ? "[clip-path:inset(0_0_0_0)]" : "pointer-events-none [clip-path:inset(0_0_100%_0)]",
      )}
    >
      <div className="container-luxe flex items-center justify-between py-6">
        <span className="flex items-center gap-3">
          <Image src="/brand/monika-luxe-mark.png" alt="" width={146} height={138} className="h-10 w-auto" />
          <span className="font-serif text-[1.35rem] tracking-[0.2em] text-gold">MONIKA LUXE</span>
        </span>
        <button ref={closeBtn} type="button" onClick={onClose} className="flex h-11 w-11 items-center justify-center">
          <span className="sr-only">Close menu</span>
          <span aria-hidden className="relative block h-5 w-7">
            <span className="absolute left-0 top-1/2 h-px w-7 rotate-45 bg-white" />
            <span className="absolute left-0 top-1/2 h-px w-7 -rotate-45 bg-white" />
          </span>
        </button>
      </div>

      <nav aria-label="Mobile" className="container-luxe flex-1 overflow-y-auto pt-6">
        <ul className="border-t border-line-light">
          {navigation.map((item, i) => (
            <li key={item.href} className="border-b border-line-light">
              <Link
                href={item.href}
                onClick={onClose}
                aria-current={isActive(item.href) ? "page" : undefined}
                className="flex items-baseline justify-between py-5 font-serif text-4xl transition-colors hover:text-gold aria-[current=page]:text-gold"
              >
                {item.label}
                <span className="eyebrow text-slate">0{i + 1}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="container-luxe flex flex-col gap-3 pb-10 pt-6 text-sm text-white/70">
        <Link
          href="/contact#enquiry"
          onClick={onClose}
          className="flex min-h-12 items-center justify-center bg-gold text-[0.75rem] uppercase tracking-[0.2em] text-navy-deep"
        >
          Book a Consultation
        </Link>
        <div className="flex justify-between pt-3">
          <a href={`tel:${company.phone.e164}`} className="py-2 hover:text-gold">
            {company.phone.display}
          </a>
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="py-2 hover:text-gold">
            WhatsApp ↗
          </a>
        </div>
      </div>
    </div>
  );
}
