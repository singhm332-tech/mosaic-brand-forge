import socialImg from "@/assets/social-grid.jpg";
import webImg from "@/assets/web-mockup.jpg";
import flyerImg from "@/assets/flyer-campaign.jpg";
import nfcImg from "@/assets/nfc-card.jpg";
import designImg from "@/assets/design-collateral.jpg";
import daycareImg from "@/assets/work-daycare.jpg";
import brandingImg from "@/assets/work-branding.jpg";

export type ServiceRoute =
  | "/social-media-marketing"
  | "/web-design-seo"
  | "/flyer-campaigns"
  | "/nfc-review-cards"
  | "/graphic-design";

export type Service = {
  number: string;
  name: string;
  to: ServiceRoute;
  summary: string;
  image: string;
  alt: string;
};

export const services: Service[] = [
  {
    number: "01",
    name: "Social Media",
    to: "/social-media-marketing",
    summary: "Strategy, content and day-to-day management that keeps a brand consistent.",
    image: socialImg,
    alt: "Grid of minimal social media posts designed for a small business",
  },
  {
    number: "02",
    name: "Websites & SEO",
    to: "/web-design-seo",
    summary: "Fast, mobile-first websites built around credibility and conversion.",
    image: webImg,
    alt: "Laptop and phone showing a responsive business website design",
  },
  {
    number: "03",
    name: "Solo Flyer Campaigns",
    to: "/flyer-campaigns",
    summary: "One business, one dedicated print campaign, targeted to local neighbourhoods.",
    image: flyerImg,
    alt: "Premium printed direct-mail postcard for a single local business",
  },
  {
    number: "04",
    name: "NFC & Reputation",
    to: "/nfc-review-cards",
    summary: "Tap cards that take customers straight to a business's Google profile.",
    image: nfcImg,
    alt: "Matte black NFC review card resting beside a smartphone",
  },
  {
    number: "05",
    name: "Graphic Design",
    to: "/graphic-design",
    summary: "Flyers, cards, ads and brand assets that hold together as one identity.",
    image: designImg,
    alt: "Printed marketing collateral including a poster, flyer and business cards",
  },
];

export type Project = {
  slug: string;
  client: string;
  disciplines: string[];
  description: string;
  image: string;
  alt: string;
  size: "wide" | "half";
};

/** Placeholder projects — replace image, client and copy with real work. */
export const projects: Project[] = [
  {
    slug: "park-plaza-daycare",
    client: "Park Plaza Daycare",
    disciplines: ["Website", "Social Media", "Local Marketing"],
    description:
      "A new website, a consistent social presence and local marketing built around enrolment enquiries.",
    image: daycareImg,
    alt: "Warm, bright reception area of a childcare centre",
    size: "wide",
  },
  {
    slug: "local-business-campaign",
    client: "Local Business Campaign",
    disciplines: ["Direct Mail", "Graphic Design"],
    description: "A dedicated flyer campaign designed, targeted and prepared for local distribution.",
    image: flyerImg,
    alt: "Printed direct-mail postcard designed for one local business",
    size: "half",
  },
  {
    slug: "brand-identity-system",
    client: "Brand Identity System",
    disciplines: ["Branding", "Print"],
    description: "A compact identity system — mark, palette and stationery — for a growing service business.",
    image: brandingImg,
    alt: "Brand identity sheet with logo variations, colour swatch cards and an envelope",
    size: "half",
  },
  {
    slug: "social-content-programme",
    client: "Social Content Programme",
    disciplines: ["Content", "Reels", "Management"],
    description: "A month-by-month content system that keeps posting consistent and on-brand.",
    image: socialImg,
    alt: "Nine-post social media content grid in a neutral brand palette",
    size: "half",
  },
  {
    slug: "review-card-rollout",
    client: "Review Card Rollout",
    disciplines: ["NFC", "Reputation"],
    description: "Custom NFC cards placed at the counter so customers can reach the Google profile with a tap.",
    image: nfcImg,
    alt: "Matte black NFC card beside a phone on a dark surface",
    size: "half",
  },
];

export type Testimonial = { quote: string; name: string; role: string };

/** Only real, client-provided testimonials belong here. Leave empty otherwise. */
export const testimonials: Testimonial[] = [];
