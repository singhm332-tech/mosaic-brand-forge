import { createFileRoute } from "@tanstack/react-router";
import { ServicePage } from "@/components/site/ServicePage";
import { ServiceWork, filterProjectsByService } from "@/components/site/ServiceWork";
import { getPublicProjects } from "@/lib/public-content.functions";
import { projects as fallbackProjects } from "@/data/site";
import webImg from "@/assets/web-mockup.jpg";

const title = "Website Design & SEO — AdMosaic, Edmonton";
const description =
  "Fast, mobile-first business websites built around credibility, usability, conversion and local search foundations.";

export const Route = createFileRoute("/web-design-seo")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "/web-design-seo" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/web-design-seo" }],
  }),
  loader: async () => ({ dbProjects: await getPublicProjects() }),
  component: Page,
});

function Page() {
  const { dbProjects } = Route.useLoaderData();
  const all = dbProjects.length > 0 ? dbProjects : fallbackProjects;
  const work = filterProjectsByService(all, ["website", "web", "seo"]);

  return (
    <ServicePage
      workCta="See Our Websites"
      showcase={
        work.length > 0 ? (
          <ServiceWork
            heading="Websites we’ve built."
            intro="Examples of website and search work we’ve delivered for local businesses."
            projects={work}
          />
        ) : undefined
      }
      current="/web-design-seo"
      index="02"
      eyebrow="Websites & SEO"
      title="Your website should work as hard as you do."
      intro="Modern business websites designed around credibility, usability, conversion and search visibility."
      image={webImg}
      alt="Desktop and mobile mockups of a modern business website"
      cta="Build My Website"
      capabilities={[
        "Modern business websites",
        "Mobile-responsive development",
        "Conversion-focused layouts",
        "SEO-friendly architecture",
        "Local SEO foundations",
        "Website redesigns",
      ]}
      body={
        <>
          <p>
            Most people check a website before they call. It should load quickly, read clearly on a
            phone, and make the next step obvious.
          </p>
          <p>
            We design and build the site around the decisions your customers are making — services,
            proof, location, contact — then structure the pages, headings and metadata so search
            engines can understand them.
          </p>
          <p>
            We set local SEO foundations, including Google Business Profile alignment and location
            pages where relevant. We don't promise rankings; we build the groundwork that makes
            them possible.
          </p>
        </>
      }
      process={[
        { step: "01", label: "Discover", text: "Goals, audience, competitors and content inventory." },
        { step: "02", label: "Design", text: "Layouts and typography that fit the brand, not a template." },
        { step: "03", label: "Build", text: "Fast, responsive, accessible development." },
        { step: "04", label: "Launch", text: "Testing, analytics, search setup and handover." },
      ]}
    />
  );
}
