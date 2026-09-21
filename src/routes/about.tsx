import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";
import { Copy, Eyebrow, Section, T } from "@/components/site/Primitives";
import { FinalCta } from "@/components/site/ServicePage";
import { useSiteContent } from "@/lib/content";
import heroImg from "@/assets/hero-collateral.jpg";

const title = "About — AdMosaic Marketing, Edmonton";
const description =
  "AdMosaic is an Edmonton-based marketing agency combining digital strategy, design and local marketing for growing businesses.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "/about" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { get } = useSiteContent();

  return (
    <>
      <section className="shell pt-20 pb-16 md:pt-28 md:pb-24">
        <Reveal>
          <Eyebrow>About</Eyebrow>
          <h1 className="display mt-8 max-w-4xl text-[clamp(2.75rem,8vw,6rem)]">
            <T value={get("about_headline", "")}>
              <>
                Built locally.
                <br />
                Thinking bigger.
              </>
            </T>
          </h1>
        </Reveal>
      </section>

      <Reveal className="shell">
        <img
          src={get("about_image", heroImg)}
          alt="AdMosaic printed brand collateral arranged on a warm ivory surface"
          loading="lazy"
          width={1600}
          height={1200}
          className="aspect-21/9 w-full object-cover"
        />
      </Reveal>

      <Section>
        <div className="shell grid gap-14 md:grid-cols-[1fr_1fr]">
          <Reveal className="max-w-xl space-y-6 text-base leading-relaxed text-muted-foreground md:text-lg">
            <Copy value={get("about_body", "")}>
              <>
                <p>
                  AdMosaic started in Edmonton with two university students and a simple idea:
                  quality marketing shouldn't be out of reach for growing businesses. We saw how
                  difficult it could be for businesses to get their name out there and build a
                  strong presence without spending heavily on marketing. So, we created AdMosaic to
                  offer professional, creative and affordable marketing that helps businesses get
                  noticed, connect with their communities and grow.
                </p>
                <p>
                  What started as two students putting their skills and ideas together has grown
                  into a commitment to helping businesses tell their story and build a presence
                  they're proud of. Whether it's through social media, design, websites or local
                  marketing, our goal is simple: make great marketing more accessible and help
                  businesses get their name out there.
                </p>
              </>
            </Copy>
          </Reveal>

          <Reveal delay={80}>
            <h2 className="eyebrow text-muted-foreground">
              {get("about_how_heading", "How we work")}
            </h2>
            <dl className="mt-8">
              {[
                ["Specific over clever", "Every decision answers a business question first."],
                ["One consistent presence", "Website, social, print and reviews share one voice."],
                ["Local by default", "We build for the neighbourhoods a business actually serves."],
                ["Honest expectations", "No guaranteed rankings. No invented numbers."],
              ].map(([term, def]) => (
                <div key={term} className="border-t border-border py-6">
                  <dt className="text-lg">{term}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{def}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
