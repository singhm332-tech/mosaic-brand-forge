import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Reveal } from "@/components/site/Reveal";
import { Arrow, ButtonLink, Eyebrow, Section, SectionHeading } from "@/components/site/Primitives";
import { FinalCta } from "@/components/site/ServicePage";
import { projects, services, testimonials } from "@/data/site";
import heroImg from "@/assets/hero-collateral.jpg";
import webImg from "@/assets/web-mockup.jpg";
import flyerImg from "@/assets/flyer-campaign.jpg";
import nfcImg from "@/assets/nfc-card.jpg";
import socialImg from "@/assets/social-grid.jpg";
import designImg from "@/assets/design-collateral.jpg";

const title = "AdMosaic Marketing — Edmonton Marketing Agency";
const description =
  "AdMosaic is an Edmonton marketing agency combining social media, web design, SEO, flyer campaigns, NFC review cards and graphic design under one partner.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "/" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <Hero />
      <Statement />
      <ServicesIndex />
      <SelectedWork />
      <FlyerFeature />
      <WebFeature />
      <NfcFeature />
      <SocialFeature />
      <DesignFeature />
      <WhyAdMosaic />
      <Testimonials />
      <FinalCta />
    </>
  );
}

function Hero() {
  return (
    <section className="shell pt-16 pb-20 md:pt-24 md:pb-28">
      <div className="grid items-end gap-14 lg:grid-cols-[1.25fr_0.75fr]">
        <div>
          <Eyebrow>AdMosaic — Edmonton Marketing Agency</Eyebrow>
          <h1 className="display mt-8 text-[clamp(2.75rem,8.5vw,7rem)]">
            Marketing that makes
            <br />
            businesses <em className="italic">impossible</em>
            <br />
            to overlook.
          </h1>
          <p className="mt-10 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
            AdMosaic combines digital strategy, design and local marketing to help businesses
            build stronger brands and reach more customers.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <ButtonLink to="/contact">
              Start a Project <Arrow />
            </ButtonLink>
            <ButtonLink to="/work" variant="outline">
              Explore Our Work
            </ButtonLink>
          </div>
        </div>

        <img
          src={heroImg}
          alt="Printed AdMosaic campaign collateral arranged on a warm ivory surface"
          width={1600}
          height={1200}
          fetchPriority="high"
          className="aspect-4/3 w-full object-cover lg:aspect-3/4"
        />
      </div>

      <ul className="mt-20 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-border pt-6">
        {["Social", "Web", "SEO", "Print", "Design", "Reputation"].map((item) => (
          <li key={item} className="eyebrow text-muted-foreground">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

function Statement() {
  return (
    <Section tone="sand">
      <div className="shell grid gap-12 md:grid-cols-[1fr_1fr]">
        <Reveal>
          <h2 className="display text-[clamp(2.25rem,5.5vw,4.25rem)]">
            Everything your brand needs to move forward.
          </h2>
        </Reveal>
        <Reveal delay={80} className="space-y-6 self-end text-base leading-relaxed text-muted-foreground md:text-lg">
          <p>
            Businesses shouldn't need five different companies to manage their website, social
            media, print marketing, design and online reputation.
          </p>
          <p>AdMosaic brings those pieces together under one creative partner.</p>
        </Reveal>
      </div>
    </Section>
  );
}

function ServicesIndex() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <Section id="services">
      <div className="shell">
        <SectionHeading eyebrow="Services" title="What we do." />

        <ul className="relative mt-16">
          {services.map((s) => (
            <li key={s.to}>
              <Link
                to={s.to}
                onMouseEnter={() => setActive(s.to)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(s.to)}
                onBlur={() => setActive(null)}
                className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-x-6 gap-y-2 border-t border-border py-7 transition-colors duration-200 hover:border-foreground/40 md:grid-cols-[4rem_1fr_1fr_auto] md:py-9"
              >
                <span className="eyebrow text-muted-foreground">{s.number}</span>
                <span className="display text-3xl transition-transform duration-300 group-hover:translate-x-1 md:text-5xl">
                  {s.name}
                </span>
                <span className="col-span-3 max-w-sm text-sm leading-relaxed text-muted-foreground md:col-span-1 md:text-base">
                  {s.summary}
                </span>
                <Arrow className="justify-self-end text-xl" />
              </Link>
            </li>
          ))}
          <li className="border-t border-border" />

          <div className="pointer-events-none absolute top-0 right-0 hidden h-full w-[26%] lg:block">
            {services.map((s) => (
              <img
                key={s.to}
                src={s.image}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className={`absolute top-1/2 right-0 aspect-4/3 w-full -translate-y-1/2 object-cover transition-opacity duration-300 ${
                  active === s.to ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </div>
        </ul>
      </div>
    </Section>
  );
}

function SelectedWork() {
  const [wide, ...rest] = projects;

  return (
    <Section tone="sand" id="work">
      <div className="shell">
        <SectionHeading
          eyebrow="Portfolio"
          title="Selected Work"
          intro="A look at how we help businesses show up better — online and offline."
        />

        <div className="mt-16 space-y-16">
          <Reveal>
            <ProjectCard project={wide} priority />
          </Reveal>
          <div className="grid gap-16 md:grid-cols-2">
            {rest.slice(0, 2).map((p, i) => (
              <Reveal key={p.slug} delay={i * 80}>
                <ProjectCard project={p} />
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <ButtonLink to="/work" variant="outline">
            View all work <Arrow />
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}

export function ProjectCard({
  project,
  priority = false,
}: {
  project: (typeof projects)[number];
  priority?: boolean;
}) {
  return (
    <article className="group">
      <div className="overflow-hidden">
        <img
          src={project.image}
          alt={project.alt}
          loading={priority ? "eager" : "lazy"}
          className={`w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02] ${
            project.size === "wide" ? "aspect-16/9" : "aspect-4/3"
          }`}
        />
      </div>
      <div className="mt-6 flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="text-xl tracking-tight uppercase">{project.client}</h3>
        <p className="text-sm text-muted-foreground">{project.disciplines.join(" • ")}</p>
      </div>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
        {project.description}
      </p>
    </article>
  );
}

function FlyerFeature() {
  const steps = [
    { step: "01", label: "Strategy" },
    { step: "02", label: "Design" },
    { step: "03", label: "Target" },
    { step: "04", label: "Distribute" },
  ];

  return (
    <Section tone="dark">
      <div className="shell grid items-center gap-16 lg:grid-cols-2">
        <Reveal>
          <Eyebrow className="text-ink-muted">03 — Solo Flyer Campaigns</Eyebrow>
          <h2 className="display mt-8 text-[clamp(2.5rem,6vw,4.5rem)]">Own the mailbox.</h2>
          <div className="mt-8 max-w-lg space-y-5 text-base leading-relaxed text-ink-muted md:text-lg">
            <p>
              Digital ads disappear with a scroll. A great piece of print gets held, noticed and
              remembered.
            </p>
            <p>
              AdMosaic creates dedicated flyer campaigns for businesses — from design and targeting
              to preparing the campaign for local distribution.
            </p>
          </div>

          <ol className="mt-12 grid grid-cols-2 gap-px bg-ink-border sm:grid-cols-4">
            {steps.map((s) => (
              <li key={s.step} className="bg-ink py-5 pr-4">
                <span className="eyebrow text-accent">{s.step}</span>
                <p className="mt-2 text-base">{s.label}</p>
              </li>
            ))}
          </ol>

          <div className="mt-12">
            <ButtonLink to="/flyer-campaigns" variant="onDark">
              Plan a Campaign <Arrow />
            </ButtonLink>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <img
            src={flyerImg}
            alt="A single premium direct-mail postcard designed for one local business"
            loading="lazy"
            width={1408}
            height={1056}
            className="w-full object-cover"
          />
        </Reveal>
      </div>
    </Section>
  );
}

function WebFeature() {
  const highlights = [
    "Responsive Design",
    "Local SEO Foundations",
    "Conversion-Focused UX",
    "Performance",
    "Modern Development",
  ];

  return (
    <Section>
      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-[1fr_1fr]">
          <Reveal>
            <Eyebrow>02 — Websites & SEO</Eyebrow>
            <h2 className="display mt-8 text-[clamp(2.25rem,5.5vw,4.25rem)]">
              Your website should work as hard as you do.
            </h2>
          </Reveal>
          <Reveal delay={80} className="max-w-lg self-end space-y-5 text-base leading-relaxed text-muted-foreground md:text-lg">
            <p>
              We build fast, mobile-first websites designed around credibility, usability and
              conversion — with a clean structure search engines can read.
            </p>
            <div className="pt-2">
              <ButtonLink to="/web-design-seo">
                Build My Website <Arrow />
              </ButtonLink>
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-16">
          <img
            src={webImg}
            alt="Desktop and mobile mockups of a modern business website built by AdMosaic"
            loading="lazy"
            width={1600}
            height={1104}
            className="w-full object-cover"
          />
        </Reveal>

        <ul className="mt-12 grid gap-px border-t border-border sm:grid-cols-2 lg:grid-cols-5">
          {highlights.map((h) => (
            <li key={h} className="border-b border-border py-5 text-sm lg:border-b-0">
              {h}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

function NfcFeature() {
  return (
    <Section tone="dark">
      <div className="shell grid items-center gap-16 lg:grid-cols-[0.95fr_1.05fr]">
        <Reveal delay={60} className="order-2 lg:order-1">
          <img
            src={nfcImg}
            alt="Matte black AdMosaic NFC review card resting beside a smartphone"
            loading="lazy"
            width={1408}
            height={1056}
            className="w-full object-cover"
          />
        </Reveal>

        <Reveal className="order-1 lg:order-2">
          <Eyebrow className="text-ink-muted">04 — NFC & Reputation</Eyebrow>
          <h2 className="display mt-8 text-[clamp(2.25rem,5.5vw,4.25rem)]">
            Turn great experiences into great reviews.
          </h2>
          <div className="mt-8 max-w-lg space-y-5 text-base leading-relaxed text-ink-muted md:text-lg">
            <p>
              Our custom NFC cards let a customer reach a business's Google profile with a tap —
              at the counter, on the table, or on the way out.
            </p>
            <p>
              Steady review activity and a well-maintained Google Business Profile can support how
              a business shows up in local search.
            </p>
          </div>

          <ol className="mt-12 flex flex-wrap items-center gap-x-4 gap-y-3">
            {["Tap", "Google", "Review"].map((step, i) => (
              <li key={step} className="flex items-center gap-4">
                <span className="eyebrow text-accent">{step}</span>
                {i < 2 ? <span className="text-ink-muted">→</span> : null}
              </li>
            ))}
          </ol>

          <div className="mt-12">
            <ButtonLink to="/nfc-review-cards" variant="onDark">
              Explore NFC Cards <Arrow />
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

function SocialFeature() {
  const items = ["Strategy", "Content Creation", "Reels", "Management", "Campaigns", "Brand Consistency"];

  return (
    <Section tone="sand">
      <div className="shell grid items-center gap-16 lg:grid-cols-2">
        <Reveal>
          <Eyebrow>01 — Social Media</Eyebrow>
          <h2 className="display mt-8 text-[clamp(2.25rem,5.5vw,4.25rem)]">
            Look like a brand worth following.
          </h2>
          <p className="mt-8 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
            We help businesses build a consistent, professional social presence — a plan, a look
            and a posting rhythm instead of whatever fits in the day.
          </p>

          <ul className="mt-12 grid grid-cols-2 gap-x-8">
            {items.map((i) => (
              <li key={i} className="border-t border-border py-3.5 text-sm">
                {i}
              </li>
            ))}
          </ul>

          <div className="mt-12">
            <ButtonLink to="/social-media-marketing" variant="outline">
              Social Media Marketing <Arrow />
            </ButtonLink>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <img
            src={socialImg}
            alt="Grid of nine on-brand social media posts designed for a local business"
            loading="lazy"
            width={1408}
            height={1408}
            className="w-full object-cover"
          />
        </Reveal>
      </div>
    </Section>
  );
}

function DesignFeature() {
  return (
    <Section>
      <div className="shell">
        <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
          <Reveal>
            <Eyebrow>05 — Graphic Design</Eyebrow>
            <h2 className="display mt-8 text-[clamp(2.25rem,5.5vw,4.25rem)]">
              Good design earns attention.
            </h2>
          </Reveal>
          <Reveal delay={60}>
            <ButtonLink to="/graphic-design" variant="outline">
              Design & Branding <Arrow />
            </ButtonLink>
          </Reveal>
        </div>

        <Reveal className="mt-14">
          <img
            src={designImg}
            alt="Printed brand collateral: poster, folded flyer, business cards and stationery"
            loading="lazy"
            width={1600}
            height={1104}
            className="w-full object-cover"
          />
        </Reveal>

        <ul className="mt-10 flex flex-wrap gap-x-10 gap-y-3 border-t border-border pt-6">
          {["Flyers", "Business Cards", "Social Posts", "Posters", "Advertisements", "Marketing Materials"].map(
            (i) => (
              <li key={i} className="text-sm text-muted-foreground">
                {i}
              </li>
            ),
          )}
        </ul>
      </div>
    </Section>
  );
}

function WhyAdMosaic() {
  const journey = ["Discover", "Trust", "Engage", "Convert"];

  return (
    <Section tone="sand">
      <div className="shell grid gap-16 lg:grid-cols-[1fr_1fr]">
        <Reveal>
          <Eyebrow>Why AdMosaic</Eyebrow>
          <h2 className="display mt-8 text-[clamp(2.25rem,5.5vw,4.25rem)]">
            One partner. Every touchpoint.
          </h2>
          <div className="mt-8 max-w-lg space-y-5 text-base leading-relaxed text-muted-foreground md:text-lg">
            <p>
              A customer may discover a business through Instagram, visit its website, read its
              Google reviews, receive its flyer, and eventually walk through the door.
            </p>
            <p>Those experiences shouldn't feel disconnected.</p>
          </div>
        </Reveal>

        <Reveal delay={80} className="self-center">
          <ol className="border-t border-border">
            {journey.map((step, i) => (
              <li
                key={step}
                className="flex items-baseline justify-between border-b border-border py-6"
              >
                <span className="display text-3xl md:text-4xl">{step}</span>
                <span className="eyebrow text-muted-foreground">0{i + 1}</span>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </Section>
  );
}

function Testimonials() {
  if (testimonials.length === 0) return null;

  return (
    <Section>
      <div className="shell max-w-4xl">
        {testimonials.map((t) => (
          <figure key={t.name} className="border-t border-border pt-10 first:border-t-0">
            <blockquote className="display text-[clamp(1.75rem,4vw,3rem)]">
              “{t.quote}”
            </blockquote>
            <figcaption className="mt-8 text-sm text-muted-foreground">
              {t.name} — {t.role}
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}
