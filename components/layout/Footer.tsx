import Image from "next/image";
import Link from "next/link";
import { company, navigation, services, whatsappLink } from "@/lib/content";
import FooterReveal from "./FooterReveal";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <FooterReveal>
      <footer className="relative bg-navy-deep text-white">
        <div className="container-luxe pb-10 pt-24 md:pt-32">
          <div className="grid gap-16 md:grid-cols-12">
            <div className="md:col-span-6">
              <Image
                src="/brand/monika-luxe-logo.png"
                alt="Monika Luxe Construction & Interior logo"
                width={250}
                height={262}
                className="mb-10 h-36 w-auto md:h-44"
              />
              <p className="eyebrow text-gold">Thanjavur · Tamil Nadu</p>
              <p className="mt-6 max-w-xl font-serif text-[clamp(2.2rem,4.6vw,4.4rem)] leading-[1.02]">
                Your vision. <em className="text-gold-light">Our craft.</em>
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/contact#enquiry"
                  className="inline-flex min-h-12 items-center bg-gold px-7 text-[0.75rem] uppercase tracking-[0.2em] text-navy-deep transition-colors hover:bg-white"
                >
                  Start Your Project
                </Link>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center border border-line-light px-7 text-[0.75rem] uppercase tracking-[0.2em] transition-colors hover:border-gold hover:text-gold"
                >
                  WhatsApp us ↗
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-10 md:col-span-6 md:grid-cols-3">
              <div>
                <p className="eyebrow mb-5 text-slate">Studio</p>
                <ul className="space-y-3 text-sm text-white/75">
                  {navigation.map((n) => (
                    <li key={n.href}>
                      <Link href={n.href} className="hover:text-gold">
                        {n.label}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link href="/about#team" className="hover:text-gold">
                      Team
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <p className="eyebrow mb-5 text-slate">Services</p>
                <ul className="space-y-3 text-sm text-white/75">
                  {services.slice(0, 7).map((s) => (
                    <li key={s.slug}>
                      <Link href={`/services/${s.slug}`} className="hover:text-gold">
                        {s.eyebrow}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-span-2 md:col-span-1">
                <p className="eyebrow mb-5 text-slate">Visit</p>
                <address className="space-y-3 text-sm not-italic leading-relaxed text-white/75">
                  <a href={company.mapsDirections} target="_blank" rel="noopener noreferrer" className="block hover:text-gold">
                    {company.address.line1}
                    <br />
                    {company.address.city} – {company.address.postalCode}
                    <br />
                    {company.address.region}
                  </a>
                  <a href={`tel:${company.phone.e164}`} className="block hover:text-gold">
                    {company.phone.display}
                  </a>
                  <a href={`mailto:${company.email.address}`} className="block break-all hover:text-gold">
                    {company.email.address}
                  </a>
                </address>
              </div>
            </div>
          </div>

          <p
            aria-hidden
            className="mt-24 select-none whitespace-nowrap text-center font-serif text-[16.5vw] leading-[0.8] tracking-[0.04em] text-white/[0.06]"
          >
            MONIKA LUXE
          </p>

          <div className="mt-8 flex flex-col justify-between gap-4 border-t border-line-light pt-8 text-xs text-white/45 md:flex-row">
            <p>
              © {year} {company.name}. All rights reserved.
            </p>
            <p>Interior design &amp; construction in Thanjavur, Tamil Nadu.</p>
          </div>
        </div>
      </footer>
    </FooterReveal>
  );
}
