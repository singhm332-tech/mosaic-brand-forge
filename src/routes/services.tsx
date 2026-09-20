import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";
import { Arrow, Eyebrow, Section } from "@/components/site/Primitives";
import { FinalCta } from "@/components/site/ServicePage";
import { services } from "@/data/site";
import { getPublicServices } from "@/lib/public-content.functions";

const title = "Services — AdMosaic Marketing";
const description =
  "Social media marketing, website design and SEO, solo flyer campaigns, NFC review cards and graphic design from an Edmonton agency.";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "/services" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  loader: async () => ({ dbServices: await getPublicServices() }),
  component: ServicesPage,
});

function ServicesPage() {
  const { dbServices } = Route.useLoaderData();
  // Admin edits override the built-in wording; the page keeps its fixed routes.
  const items = services.map((s) => {
    const row = dbServices.find((d) => `/${d.slug}` === s.to);
    return row
      ? { ...s, name: row.name || s.name, number: row.number || s.number, summary: row.summary || s.summary }
      : s;
  });

  return (
    <>
      <section className="shell pt-20 pb-16 md:pt-28 md:pb-20">
        <Reveal>
          <Eyebrow>Services</Eyebrow>
          <h1 className="display mt-8 max-w-4xl text-[clamp(2.75rem,8vw,6rem)]">What we do.</h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Five services, built to work together. Take one, or hand us the whole picture.
          </p>
        </Reveal>
      </section>

      <Section className="pt-0">
        <div className="shell">
          <ul>
            {items.map((s, i) => (
              <li key={s.to}>
                <Reveal delay={i * 60}>
                  <Link
                    to={s.to}
                    className="group grid grid-cols-1 items-center gap-6 border-t border-border py-8 md:grid-cols-[4rem_1fr_1.1fr_auto] md:py-10"
                  >
                    <span className="eyebrow text-muted-foreground">{s.number}</span>
                    <span className="display text-3xl transition-transform duration-300 group-hover:translate-x-1 md:text-5xl">
                      {s.name}
                    </span>
                    <span className="max-w-sm text-sm leading-relaxed text-muted-foreground md:text-base">
                      {s.summary}
                    </span>
                    <Arrow className="text-xl md:justify-self-end" />
                  </Link>
                </Reveal>
              </li>
            ))}
            <li className="border-t border-border" />
          </ul>
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
