import { createFileRoute } from "@tanstack/react-router";
import { ServicePage } from "@/components/site/ServicePage";
import flyerImg from "@/assets/flyer-campaign.jpg";

const title = "Solo Flyer Campaigns — AdMosaic, Edmonton";
const description =
  "Dedicated direct-mail flyer campaigns for one business: strategy, design, neighbourhood targeting and distribution prep.";

export const Route = createFileRoute("/flyer-campaigns")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "/flyer-campaigns" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/flyer-campaigns" }],
  }),
  component: Page,
});

function Page() {
  return (
    <ServicePage
      current="/flyer-campaigns"
      index="03"
      eyebrow="Solo Flyer Campaigns"
      title="Own the mailbox."
      intro="Digital ads disappear with a scroll. A great piece of print gets held, noticed and remembered."
      image={flyerImg}
      alt="A single premium direct-mail postcard designed for one local business"
      cta="Plan a Campaign"
      capabilities={[
        "One business per campaign",
        "Concept and campaign strategy",
        "Print-ready flyer and postcard design",
        "Neighbourhood and route targeting",
        "Print coordination",
        "Distribution preparation",
      ]}
      body={
        <>
          <p>
            Every campaign belongs to one business. Your offer gets the whole piece — front and
            back — with nothing else competing for attention.
          </p>
          <p>
            We design the piece, choose the neighbourhoods worth reaching, and prepare everything
            for local distribution. Print is deliberate: stock, size and finish are part of the
            impression.
          </p>
          <p>
            It works especially well alongside a website refresh or a review programme, so people
            who receive the flyer find the same brand when they look you up.
          </p>
        </>
      }
      process={[
        { step: "01", label: "Strategy", text: "The offer, the audience and the outcome worth measuring." },
        { step: "02", label: "Design", text: "A single-business piece designed for print, not repurposed." },
        { step: "03", label: "Target", text: "Neighbourhood selection based on where your customers are." },
        { step: "04", label: "Distribute", text: "Print coordination and distribution prep." },
      ]}
    />
  );
}
