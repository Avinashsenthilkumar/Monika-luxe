import type { Metadata } from "next";
import { company, siteUrl } from "./content";

interface PageMeta {
  title: string;
  description: string;
  path: string;
}

export function pageMetadata({ title, description, path }: PageMeta): Metadata {
  const url = `${siteUrl}${path === "/" ? "" : path}`;
  return {
    title,
    description,
    alternates: { canonical: url || "/" },
    openGraph: {
      title: `${title} | ${company.shortName}`,
      description,
      url,
      siteName: company.name,
      locale: "en_IN",
      type: "website",
    },
    twitter: { card: "summary_large_image", title: `${title} | ${company.shortName}`, description },
  };
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["HomeAndConstructionBusiness", "GeneralContractor"],
    "@id": `${siteUrl}/#business`,
    name: company.name,
    alternateName: company.shortName,
    description: company.intro,
    url: siteUrl,
    telephone: company.phone.e164,
    image: `${siteUrl}/opengraph-image`,
    address: {
      "@type": "PostalAddress",
      streetAddress: company.address.line1,
      addressLocality: company.address.city,
      postalCode: company.address.postalCode,
      addressRegion: company.address.region,
      addressCountry: company.address.country,
    },
    areaServed: { "@type": "State", name: "Tamil Nadu" },
    founder: { "@type": "Person", name: "Er. V. Monika", jobTitle: "Founder & Civil Engineer" },
    hasMap: company.mapsDirections,
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${siteUrl}${item.path === "/" ? "" : item.path}`,
    })),
  };
}
