import type { Metadata } from "next";
import DesignProcess from "@/components/home/DesignProcess";
import ConsultationCTA from "@/components/home/ConsultationCTA";
import PageHero from "@/components/ui/PageHero";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Our Process — Consultation to Handover",
  description:
    "How Monika Luxe works: consultation, planning and design, material selection, execution, and finishing and handover — one coordinated team in Thanjavur.",
  path: "/process",
});

export default function ProcessPage() {
  return (
    <>
      <PageHero
        eyebrow="Process"
        title={
          <>
            How We <em className="text-gold-light">Work.</em>
          </>
        }
        intro={<p>Five clear stages, one coordinated team — from the first conversation to the day we hand over your space.</p>}
        crumbs={[{ name: "Process", path: "/process" }]}
      />
      <DesignProcess />
      <ConsultationCTA id="process-enquiry" />
    </>
  );
}
