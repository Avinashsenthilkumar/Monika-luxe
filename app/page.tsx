import type { Metadata } from "next";
import ArchitecturalJourney from "@/components/experience/ArchitecturalJourney";
import type { RoomSlide } from "@/components/experience/InteriorRevealScene";
import Hero from "@/components/home/Hero";
import StudioIntroduction from "@/components/home/StudioIntroduction";
import ServicesShowcase from "@/components/home/ServicesShowcase";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import Testimonials from "@/components/home/Testimonials";
import ConsultationCTA from "@/components/home/ConsultationCTA";
import { resolveId, resolveIds } from "@/lib/assets.server";
import { getProject, projects, services } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { toCardData } from "@/lib/projects";

export const metadata: Metadata = pageMetadata({
  title: "Luxury Interior Design & Construction in Thanjavur",
  description:
    "Monika Luxe Construction & Interiors — luxury interior design, modular kitchens, construction, renovation and turnkey projects in Thanjavur, Tamil Nadu.",
  path: "/",
});

function room(slug: string, title: string, kicker: string, imageIndex = 0): RoomSlide | null {
  const p = getProject(slug);
  if (!p || !p.images[imageIndex]) return null;
  return { id: slug, title, kicker, text: p.description, href: `/projects/${slug}`, image: resolveId(p.images[imageIndex]) };
}

export default function HomePage() {
  const rooms = [
    room("living-rooms", "The Living Room", "Living rooms"),
    room("kitchens", "The Kitchen", "Modular kitchens"),
    room("bedrooms", "The Bedroom", "Bedrooms"),
    room("office-spaces", "The Workspace", "Office spaces"),
  ].filter((r): r is RoomSlide => r !== null);

  const showcase = services.slice(0, 7).map((s) => ({ ...s, resolved: resolveIds(s.images.slice(0, 1)) }));

  return (
    <>
      <Hero />
      <ArchitecturalJourney rooms={rooms} />
      <StudioIntroduction founder={resolveId("teamMonika")} />
      <ServicesShowcase items={showcase} />
      <FeaturedProjects projects={projects.map(toCardData)} />
      <Testimonials />
      <ConsultationCTA />
    </>
  );
}
