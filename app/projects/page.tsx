import type { Metadata } from "next";
import ProjectGrid from "@/components/projects/ProjectGrid";
import ConsultationCTA from "@/components/home/ConsultationCTA";
import PageHero from "@/components/ui/PageHero";
import { projects } from "@/lib/content";
import { toCardData } from "@/lib/projects";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Portfolio — Living Rooms, Kitchens, Bedrooms & Offices",
  description:
    "Interior design portfolio from Monika Luxe, Thanjavur — living rooms, modular kitchens, bedrooms and office spaces.",
  path: "/projects",
});

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title={
          <>
            Rooms, <em className="text-gold-light">Carefully Considered.</em>
          </>
        }
        intro={<p>A selection of interiors by Monika Luxe, grouped by space. Select a collection to view its gallery.</p>}
        crumbs={[{ name: "Projects", path: "/projects" }]}
      />
      <section aria-label="Portfolio collections" className="bg-navy-deep pb-28 text-white md:pb-40">
        <div className="container-luxe">
          <ProjectGrid projects={projects.map(toCardData)} />
        </div>
      </section>
      <ConsultationCTA id="projects-enquiry" />
    </>
  );
}
