import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";
import { Eyebrow, Section } from "@/components/site/Primitives";
import { FinalCta } from "@/components/site/ServicePage";
import { ProjectCard } from "./index";
import { projects } from "@/data/site";

const title = "Selected Work — AdMosaic Marketing";
const description =
  "Websites, social media, direct-mail campaigns, branding and review programmes for local businesses in Edmonton.";

export const Route = createFileRoute("/work")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "/work" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/work" }],
  }),
  component: WorkPage,
});

function WorkPage() {
  const [lead, ...rest] = projects;

  return (
    <>
      <section className="shell pt-20 pb-14 md:pt-28 md:pb-16">
        <Reveal>
          <Eyebrow>Portfolio</Eyebrow>
          <h1 className="display mt-8 max-w-4xl text-[clamp(2.75rem,8vw,6rem)]">Selected Work</h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
            A look at how we help businesses show up better — online and offline.
          </p>
        </Reveal>
      </section>

      <Section className="pt-4">
        <div className="shell space-y-16">
          <Reveal>
            <ProjectCard project={lead} priority />
          </Reveal>
          <div className="grid gap-16 md:grid-cols-2">
            {rest.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 2) * 80}>
                <ProjectCard project={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
