import { createFileRoute } from "@tanstack/react-router";
import { ServicePage } from "@/components/site/ServicePage";
import socialImg from "@/assets/social-grid.jpg";

const title = "Social Media Marketing — AdMosaic, Edmonton";
const description =
  "Social media strategy, content creation, reels and account management that keeps a business consistent and on-brand.";

export const Route = createFileRoute("/social-media-marketing")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "/social-media-marketing" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/social-media-marketing" }],
  }),
  component: Page,
});

function Page() {
  return (
    <ServicePage
      current="/social-media-marketing"
      index="01"
      eyebrow="Social Media"
      title="Look like a brand worth following."
      intro="A plan, a look and a posting rhythm — instead of whatever fits into the day."
      image={socialImg}
      alt="Grid of nine on-brand social media posts designed for a local business"
      cta="Start a Project"
      capabilities={[
        "Social media strategy",
        "Content creation",
        "Reels and short-form video",
        "Account management",
        "Brand consistency",
        "Campaign and advertising support",
      ]}
      body={
        <>
          <p>
            We start with the business, not the platform: who you're trying to reach, what you
            actually sell, and what makes people choose you.
          </p>
          <p>
            From there we build a content system — templates, tone and a monthly plan — so every
            post looks like it came from the same brand. We can shoot and produce the content,
            manage the accounts day to day, or hand you a kit your team can run.
          </p>
          <p>
            When it makes sense, we support paid campaigns to put the best-performing content in
            front of more of the right people.
          </p>
        </>
      }
      process={[
        { step: "01", label: "Audit", text: "A look at the current presence, competitors and audience." },
        { step: "02", label: "Plan", text: "Content pillars, tone and a realistic monthly calendar." },
        { step: "03", label: "Produce", text: "Photo, video, reels and graphics built to the plan." },
        { step: "04", label: "Manage", text: "Scheduling, community replies and monthly review." },
      ]}
    />
  );
}
