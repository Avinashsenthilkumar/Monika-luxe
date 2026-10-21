import ConsultationForm from "@/components/forms/ConsultationForm";
import Reveal from "@/components/ui/Reveal";
import { company, whatsappLink } from "@/lib/content";

export default function ConsultationCTA({ id = "home-enquiry" }: { id?: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="relative bg-navy-deep text-white">
      <div className="container-luxe grid gap-16 py-28 md:grid-cols-12 md:py-40">
        <div className="md:col-span-5">
          <Reveal>
            <p className="eyebrow mb-8 flex items-center gap-4 text-gold">
              <span aria-hidden className="h-px w-10 bg-current" /> Consultation
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 id={`${id}-title`} className="font-serif text-headline text-balance">
              Let&apos;s Create a Space <em className="text-gold-light">That Feels Like You.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-md leading-relaxed text-white/65">
              Tell us about your home, your vision, and the kind of space you want to create. Let&apos;s start a conversation.
            </p>
            <dl className="mt-12 space-y-6 border-t border-line-light pt-8 text-sm">
              <div>
                <dt className="eyebrow mb-1 text-slate">Call</dt>
                <dd>
                  <a href={`tel:${company.phone.e164}`} className="font-serif text-2xl hover:text-gold">
                    {company.phone.display}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="eyebrow mb-1 text-slate">WhatsApp</dt>
                <dd>
                  <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="hover:text-gold">
                    Start a chat ↗
                  </a>
                </dd>
              </div>
              <div>
                <dt className="eyebrow mb-1 text-slate">Studio</dt>
                <dd className="text-white/70">{company.address.full}</dd>
              </div>
            </dl>
          </Reveal>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <ConsultationForm />
        </div>
      </div>
    </section>
  );
}
