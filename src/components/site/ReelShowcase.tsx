import { Instagram, Play } from "lucide-react";
import { Reveal } from "./Reveal";
import { Eyebrow, Section } from "./Primitives";

export type ReelItem = {
  client: string;
  instagramUrl?: string | undefined;
  cover: string;
  alt: string;
};

function getInstagramEmbedUrl(url?: string) {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    if (!parsed.hostname.endsWith("instagram.com")) return null;

    const match = parsed.pathname.match(/^\/(?:reel|reels|p)\/([^/]+)/);
    return match?.[1] ? `https://www.instagram.com/reel/${match[1]}/embed/` : null;
  } catch {
    return null;
  }
}

export function ReelShowcase({ reels }: { reels: ReelItem[] }) {
  return (
    <Section className="overflow-hidden border-t border-border">
      <div className="shell">
        <Reveal className="grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div className="min-w-0">
            <Eyebrow>Selected social work</Eyebrow>
            <h2 className="display mt-6 text-[clamp(2.5rem,6vw,4.75rem)]">
              Content we’ve created.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground md:text-right">
            Short-form content shaped around each client’s voice, audience and day-to-day work.
          </p>
        </Reveal>

        <div
          className="mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-5 [scrollbar-width:thin] md:gap-5"
          aria-label="Instagram Reel portfolio"
        >
          {reels.map((reel, index) => {
            const embedUrl = getInstagramEmbedUrl(reel.instagramUrl);

            return (
              <Reveal
                key={`${reel.client}-${index}`}
                delay={index * 60}
                className="w-[68vw] max-w-[20rem] shrink-0 snap-start md:w-[29vw] lg:w-[calc((100%-3.75rem)/4)] lg:max-w-none"
              >
                <article>
                  <div className="group relative aspect-[9/16] overflow-hidden bg-muted">
                    {embedUrl ? (
                      <iframe
                        src={embedUrl}
                        title={`${reel.client} Instagram Reel`}
                        loading="lazy"
                        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                        className="h-full w-full border-0 bg-background"
                      />
                    ) : (
                      <>
                        <img
                          src={reel.cover}
                          alt={reel.alt}
                          loading="lazy"
                          width={720}
                          height={1280}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                        />
                        <div className="absolute inset-0 grid place-items-center bg-foreground/10 transition-colors duration-300 group-hover:bg-foreground/5">
                          <span className="grid h-12 w-12 place-items-center rounded-full border border-ink-foreground/60 bg-ink/70 text-ink-foreground backdrop-blur-sm">
                            <Play aria-hidden="true" className="ml-0.5 h-4 w-4 fill-current" />
                          </span>
                        </div>
                      </>
                    )}

                    <span className="absolute top-4 left-4 inline-flex items-center gap-2 bg-ink/80 px-3 py-2 text-[0.625rem] font-medium uppercase text-ink-foreground backdrop-blur-sm">
                      <Instagram aria-hidden="true" className="h-3.5 w-3.5" />
                      Reel
                    </span>
                  </div>

                  <div className="mt-5 border-t border-border pt-4">
                    <h3 className="text-base font-medium">{reel.client}</h3>
                    {reel.instagramUrl ? (
                      <a
                        href={reel.instagramUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-block text-sm text-muted-foreground transition-colors hover:text-accent"
                      >
                        View on Instagram ↗
                      </a>
                    ) : (
                      <span className="mt-2 inline-block text-sm text-muted-foreground">
                        Instagram link coming soon
                      </span>
                    )}
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </Section>
  );
}