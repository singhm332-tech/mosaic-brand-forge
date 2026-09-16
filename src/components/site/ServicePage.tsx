import type { ReactNode } from "react";
import { Reveal } from "./Reveal";
import { Arrow, ButtonLink, Eyebrow, Section } from "./Primitives";
import { services, type ServiceRoute } from "@/data/site";

export function ServicePage({
  index,
  eyebrow,
  title,
  intro,
  image,
  alt,
  capabilities,
  body,
  process,
  showcase,
  hideImage = false,
  cta,
  current,
}: {
  index: string;
  eyebrow: string;
  title: ReactNode;
  intro: string;
  image: string;
  alt: string;
  capabilities: string[];
  body: ReactNode;
  process?: { step: string; label: string; text: string }[];
  showcase?: ReactNode;
  hideImage?: boolean;
  cta: string;
  current: ServiceRoute;
}) {
  const others = services.filter((s) => s.to !== current);

  return (
    <>
      <section className="shell pt-20 pb-16 md:pt-28 md:pb-24">
        <Reveal>
          <Eyebrow>
            {index} — {eyebrow}
          </Eyebrow>
          <h1 className="display mt-8 max-w-4xl text-[clamp(2.75rem,8vw,6rem)]">{title}</h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">{intro}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <ButtonLink to="/contact">
              {cta} <Arrow />
            </ButtonLink>
            <ButtonLink to="/work" variant="outline">
              See our work
            </ButtonLink>
          </div>
        </Reveal>
      </section>

      {!hideImage ? (
        <Reveal className="shell">
          <img
            src={image}
            alt={alt}
            loading="lazy"
            width={1600}
            height={1100}
            className="w-full object-cover"
          />
        </Reveal>
      ) : null}

      <Section>
        <div className="shell grid gap-16 md:grid-cols-[1.1fr_0.9fr]">
          <Reveal className="max-w-xl space-y-6 text-base leading-relaxed text-muted-foreground md:text-lg">
            {body}
          </Reveal>
          <Reveal delay={80}>
            <h2 className="eyebrow text-muted-foreground">What's included</h2>
            <ul className="mt-8">
              {capabilities.map((c) => (
                <li key={c} className="border-t border-border py-4 text-lg">
                  {c}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      {showcase}

      {process ? (
        <Section tone="dark" className="py-24">
          <div className="shell">
            <h2 className="display text-[clamp(2rem,4.5vw,3.25rem)]">How it works.</h2>
            <div className="mt-14 grid gap-px bg-ink-border sm:grid-cols-2 lg:grid-cols-4">
              {process.map((p, i) => (
                <Reveal key={p.step} delay={i * 70} className="bg-ink p-8">
                  <span className="eyebrow text-accent">{p.step}</span>
                  <h3 className="mt-5 text-xl">{p.label}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">{p.text}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </Section>
      ) : null}

      <Section tone="sand">
        <div className="shell">
          <h2 className="eyebrow text-muted-foreground">Other services</h2>
          <ul className="mt-10">
            {others.map((s) => (
              <li key={s.to}>
                <ButtonLink
                  to={s.to}
                  variant="ghost"
                  className="flex w-full items-baseline justify-between border-t border-border py-6"
                >
                  <span className="display text-3xl md:text-4xl">{s.name}</span>
                  <Arrow />
                </ButtonLink>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <FinalCta />
    </>
  );
}

export function FinalCta() {
  return (
    <Section tone="dark" className="py-32 md:py-44">
      <div className="shell">
        <Reveal>
          <h2 className="display text-[clamp(2.5rem,8vw,6.5rem)]">
            Let's make your business
            <br />
            harder to ignore.
          </h2>
          <p className="mt-8 max-w-lg text-base leading-relaxed text-ink-muted md:text-lg">
            Tell us where your business is today and where you want it to go. We'll help
            determine what gets you there.
          </p>
          <div className="mt-12 flex flex-wrap gap-4">
            <ButtonLink to="/contact" variant="onDark">
              Start a Project <Arrow />
            </ButtonLink>
            <ButtonLink
              to="/contact"
              variant="ghost"
              className="px-6 py-3 text-ink-foreground hover:text-accent"
            >
              Contact AdMosaic
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
