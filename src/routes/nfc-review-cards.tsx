import { createFileRoute } from "@tanstack/react-router";
import { ServicePage } from "@/components/site/ServicePage";
import nfcImg from "@/assets/nfc-card.jpg";

const title = "NFC Review Cards & Reputation — AdMosaic, Edmonton";
const description =
  "Custom NFC cards that take customers straight to a business's Google profile, as part of a wider local reputation strategy.";

export const Route = createFileRoute("/nfc-review-cards")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "/nfc-review-cards" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/nfc-review-cards" }],
  }),
  component: Page,
});

function Page() {
  return (
    <ServicePage
      current="/nfc-review-cards"
      index="04"
      eyebrow="NFC & Reputation"
      title="Turn great experiences into great reviews."
      intro="A tap takes a customer straight to your Google profile — while the experience is still fresh."
      image={nfcImg}
      alt="Matte black NFC review card beside a smartphone"
      cta="Order NFC Cards"
      capabilities={[
        "Custom-designed NFC cards",
        "Google profile / review link setup",
        "Counter and table placement guidance",
        "Google Business Profile review",
        "Review response approach",
        "Print and brand consistency",
      ]}
      body={
        <>
          <p>
            Most happy customers would leave a review — they just never get around to it. Removing
            the friction is the whole point.
          </p>
          <p>
            We design the card to match your brand, program it to your Google profile experience,
            and help your team use it naturally at the moments that matter.
          </p>
          <p>
            Consistent review activity and a well-maintained Google Business Profile can support a
            business's local search presence. We won't promise positions or a specific rating —
            what we can do is make it easy for real customers to speak up.
          </p>
        </>
      }
      process={[
        { step: "01", label: "Set up", text: "Google Business Profile review and review link setup." },
        { step: "02", label: "Design", text: "Cards and counter pieces designed to match the brand." },
        { step: "03", label: "Tap", text: "Customers reach the review screen in one tap." },
        { step: "04", label: "Maintain", text: "A simple routine for asking and responding." },
      ]}
    />
  );
}
