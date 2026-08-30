import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";
import { Eyebrow, Section } from "@/components/site/Primitives";
import { FinalCta } from "@/components/site/ServicePage";
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
  return (
    <>
      <section className="shell pt-20 pb-16 md:pt-28 md:pb-24">
        <Reveal>
          <Eyebrow>About</Eyebrow>
          <h1 className="display mt-8 max-w-4xl text-[clamp(2.75rem,8vw,6rem)]">
            Built locally.
            <br />
            Thinking bigger.
          </h1>
        </Reveal>
      </section>

      <Reveal className="shell">
        <img
          src={heroImg}
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
            <p>
              AdMosaic is an Edmonton-based marketing agency built around a simple idea: small and
              growing businesses deserve marketing that looks as professional as the companies
              they're competing against.
            </p>
            <p>
              We combine digital strategy, design and local marketing to help businesses build
              stronger brands and reach the people who matter.
            </p>
            <p>
              We work with a small number of clients at a time. That keeps the work considered and
              the relationship direct — you talk to the people doing the work.
            </p>
          </Reveal>

          <Reveal delay={80}>
            <h2 className="eyebrow text-muted-foreground">How we work</h2>
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
