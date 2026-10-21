import type { Metadata } from "next";
import ConsultationForm from "@/components/forms/ConsultationForm";
import PageHero from "@/components/ui/PageHero";
import { company, serviceToProjectType, whatsappLink } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact — Book a Consultation",
  description:
    "Contact Monika Luxe Construction & Interiors, Opp. New Bus Stand, Trichy Main Road, Thanjavur. Call +91 73055 20648 or send a project enquiry.",
  path: "/contact",
});

type SearchParams = Promise<{ service?: string | string[] }>;

export default async function ContactPage({ searchParams }: { searchParams: SearchParams }) {
  const { service } = await searchParams;
  const key = Array.isArray(service) ? service[0] : service;
  const defaultProjectType = key ? serviceToProjectType[key] : undefined;

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Let&apos;s Create a Space <em className="text-gold-light">That Feels Like You.</em>
          </>
        }
        intro={
          <p>Tell us about your home, your vision, and the kind of space you want to create. Let&apos;s start a conversation.</p>
        }
        crumbs={[{ name: "Contact", path: "/contact" }]}
      />

      <section id="enquiry" aria-labelledby="enquiry-title" className="scroll-mt-24 bg-navy-deep text-white">
        <div className="container-luxe grid gap-16 pb-20 md:grid-cols-12 md:pb-28">
          <aside className="md:col-span-4">
            <h2 id="enquiry-title" className="sr-only">
              Project enquiry
            </h2>
            <dl className="space-y-10 border-t border-line-light pt-8">
              <div>
                <dt className="eyebrow mb-2 text-slate">Talk with our design team</dt>
                <dd>
                  <a href={`tel:${company.phone.e164}`} className="font-serif text-3xl hover:text-gold">
                    {company.phone.display}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="eyebrow mb-2 text-slate">WhatsApp</dt>
                <dd>
                  <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="text-lg hover:text-gold">
                    Message us on WhatsApp ↗
                  </a>
                </dd>
              </div>
              <div>
                <dt className="eyebrow mb-2 text-slate">For project enquiries</dt>
                <dd>
                  <a href={`mailto:${company.email.address}`} className="break-all text-lg hover:text-gold">
                    {company.email.address}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="eyebrow mb-2 text-slate">Studio</dt>
                <dd>
                  <address className="not-italic leading-relaxed text-white/75">
                    {company.name}
                    <br />
                    {company.address.line1}
                    <br />
                    {company.address.city} – {company.address.postalCode}, {company.address.region}
                  </address>
                  <a
                    href={company.mapsDirections}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="eyebrow mt-4 inline-block border-b border-gold/50 pb-1 hover:text-gold"
                  >
                    Get directions ↗
                  </a>
                </dd>
              </div>
            </dl>
          </aside>
          <div className="md:col-span-7 md:col-start-6">
            <ConsultationForm defaultProjectType={defaultProjectType} />
          </div>
        </div>
      </section>

      <section aria-label="Map" className="bg-navy-deep">
        <div className="relative aspect-[16/9] w-full md:aspect-[21/8]">
          <iframe
            title="Monika Luxe studio location on Google Maps"
            src={company.mapsEmbed}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full border-0 grayscale-[85%] invert-[0.9] hue-rotate-180"
          />
        </div>
      </section>
    </>
  );
}
