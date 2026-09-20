import { createFileRoute } from "@tanstack/react-router";
import { ServicePage } from "@/components/site/ServicePage";
import { ServiceWork, filterProjectsByService } from "@/components/site/ServiceWork";
import { getPublicProjects } from "@/lib/public-content.functions";
import { projects as fallbackProjects } from "@/data/site";
import designImg from "@/assets/design-collateral.jpg";

const title = "Graphic Design & Branding — AdMosaic, Edmonton";
const description =
  "Flyers, business cards, social graphics, posters, advertisements and brand assets designed as one consistent identity.";

export const Route = createFileRoute("/graphic-design")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "/graphic-design" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/graphic-design" }],
  }),
  loader: async () => ({ dbProjects: await getPublicProjects() }),
  component: Page,
});

function Page() {
  const { dbProjects } = Route.useLoaderData();
  const all = dbProjects.length > 0 ? dbProjects : fallbackProjects;
  const work = filterProjectsByService(all, ["branding", "design", "print"]);

  return (
    <ServicePage
      workCta="See Our Branding Work"
      showcase={
        work.length > 0 ? (
          <ServiceWork
            heading="Design work we’ve made."
            intro="Examples of branding, print and collateral design we’ve created for businesses."
            projects={work}
          />
        ) : undefined
      }
      current="/graphic-design"
      index="05"
      eyebrow="Graphic Design & Branding"
      title="Good design earns attention."
      intro="Print and digital pieces that look like they belong to the same business."
      image={designImg}
      alt="Printed brand collateral including a poster, folded flyer and business cards"
      cta="Start a Project"
      capabilities={[
        "Flyers and posters",
        "Business cards",
        "Social media graphics",
        "Promotional materials",
        "Digital advertisements",
        "Brand assets and collateral",
      ]}
      body={
        <>
          <p>
            Design work rarely fails because it isn't pretty. It fails because five pieces were
            made by five people at five different times.
          </p>
          <p>
            We build a small, usable system — type, colour, layout and logo use — then apply it
            across everything a business hands out, posts or prints.
          </p>
          <p>
            Whether it's one flyer or a full set of collateral, the result should be recognisable
            before anyone reads a word.
          </p>
        </>
      }
    />
  );
}
