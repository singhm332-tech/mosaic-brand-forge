import { Reveal } from "./Reveal";
import { Arrow, ButtonLink, Eyebrow, Section } from "./Primitives";

export type WorkProject = {
  slug: string;
  client: string;
  disciplines: string[];
  description: string;
  image: string;
  alt: string;
  size: "wide" | "half";
};

/** Work examples for a single service, shown on that service's own page. */
export function ServiceWork({
  heading,
  intro,
  projects,
}: {
  heading: string;
  intro?: string;
  projects: WorkProject[];
}) {
  if (projects.length === 0) return null;

  const [lead, ...rest] = projects;

  return (
    <Section className="border-t border-border">
      <div className="shell">
        <Reveal className="grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div className="min-w-0">
            <Eyebrow>Our work</Eyebrow>
            <h2 className="display mt-6 text-[clamp(2.5rem,6vw,4.75rem)]">{heading}</h2>
          </div>
          {intro ? (
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground md:text-right">
              {intro}
            </p>
          ) : null}
        </Reveal>

        <div className="mt-14 space-y-16">
          {lead ? (
            <Reveal>
              <WorkCard project={{ ...lead, size: "wide" }} />
            </Reveal>
          ) : null}
          {rest.length > 0 ? (
            <div className="grid gap-16 md:grid-cols-2">
              {rest.map((p, i) => (
                <Reveal key={p.slug} delay={(i % 2) * 80}>
                  <WorkCard project={{ ...p, size: "half" }} />
                </Reveal>
              ))}
            </div>
          ) : null}
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

function WorkCard({ project }: { project: WorkProject }) {
  return (
    <article className="group">
      <div className="overflow-hidden">
        <img
          src={project.image}
          alt={project.alt}
          loading="lazy"
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

/** Selects portfolio entries whose disciplines match a service's keywords. */
export function filterProjectsByService<T extends { disciplines: string[] }>(
  projects: T[],
  keywords: string[],
): T[] {
  return projects.filter((p) =>
    p.disciplines.some((d) => keywords.some((k) => d.toLowerCase().includes(k))),
  );
}
