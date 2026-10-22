"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Images, LayoutGrid, ListChecks, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/", label: "Home", icon: Home },
  { href: "/services", label: "Services", icon: LayoutGrid },
  { href: "/projects", label: "Projects", icon: Images },
  { href: "/process", label: "Process", icon: ListChecks },
  { href: "/contact", label: "Contact", icon: MessageCircle },
];

/** Native-style bottom tab bar for phones and tablets (iOS & Android safe areas). */
export default function MobileTabBar() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="App"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line-light bg-navy-deep/95 pb-[env(safe-area-inset-bottom,0px)] lg:hidden"
    >
      <ul className="mx-auto grid max-w-xl grid-cols-5">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-16 flex-col items-center justify-center gap-1 text-[0.62rem] font-medium tracking-wide transition-[color,transform] duration-200 active:scale-95",
                  active ? "text-gold" : "text-white/60",
                )}
              >
                <Icon aria-hidden className="h-[22px] w-[22px]" strokeWidth={active ? 2 : 1.5} />
                <span>{label}</span>
                <span aria-hidden className={cn("h-[3px] w-5 rounded-full", active ? "bg-gold" : "bg-transparent")} />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
