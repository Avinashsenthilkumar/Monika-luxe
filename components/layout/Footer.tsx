import Image from "next/image";
import Link from "next/link";
import { company, navigation, services, whatsappLink } from "@/lib/content";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line-light bg-navy-deep text-white">
      <div className="container-luxe grid gap-10 py-14 md:grid-cols-12 md:gap-8 md:py-16">
        <div className="md:col-span-4">
          <Link href="/" className="inline-flex items-center gap-3" aria-label="Monika Luxe — home">
            <Image src="/brand/monika-luxe-mark.png" alt="" width={146} height={138} className="h-12 w-auto" />
            <span className="flex flex-col leading-none">
              <span className="font-serif text-xl tracking-[0.2em] text-gold">MONIKA LUXE</span>
              <span className="eyebrow mt-1.5 text-[0.55rem] text-white/60">Construction &amp; Interiors</span>
            </span>
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/60">
            Premium interior design and construction in Thanjavur, Tamil Nadu.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/contact#enquiry"
              className="inline-flex min-h-11 items-center bg-gold px-5 text-[0.7rem] uppercase tracking-[0.18em] text-navy-deep transition-colors hover:bg-white"
            >
              Start Your Project
            </Link>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center border border-line-light px-5 text-[0.7rem] uppercase tracking-[0.18em] transition-colors hover:border-gold hover:text-gold"
            >
              WhatsApp ↗
            </a>
          </div>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-8">
          <div>
            <p className="eyebrow mb-4 text-gold">Studio</p>
            <ul className="space-y-2.5 text-sm text-white/70">
              {navigation.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="hover:text-gold">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-4 text-gold">Services</p>
            <ul className="space-y-2.5 text-sm text-white/70">
              {services.slice(0, 7).map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="hover:text-gold">
                    {s.eyebrow}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <p className="eyebrow mb-4 text-gold">Visit</p>
            <address className="space-y-2.5 text-sm not-italic leading-relaxed text-white/70">
              <a href={company.mapsDirections} target="_blank" rel="noopener noreferrer" className="block hover:text-gold">
                {company.address.line1}, {company.address.city} – {company.address.postalCode}
              </a>
              <a href={`tel:${company.phone.e164}`} className="block hover:text-gold">
                {company.phone.display}
              </a>
              <a href={`mailto:${company.email.address}`} className="block break-all hover:text-gold">
                {company.email.address}
              </a>
            </address>
          </div>
        </nav>
      </div>
      <div className="border-t border-line-light">
        <div className="container-luxe flex flex-col gap-2 py-5 text-xs text-white/45 sm:flex-row sm:justify-between">
          <p>
            © {year} {company.name}
          </p>
          <p>Thanjavur · Tamil Nadu</p>
        </div>
      </div>
    </footer>
  );
}
