import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Reveal } from "@/components/site/Reveal";
import { Arrow, Eyebrow, Section } from "@/components/site/Primitives";
import { services } from "@/data/site";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const title = "Contact — AdMosaic Marketing, Edmonton";
const description =
  "Start a project with AdMosaic. Tell us where your business is today and where you want it to go.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "/contact" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

const field =
  "w-full border-b border-border bg-transparent py-3 text-base outline-none transition-colors duration-200 placeholder:text-muted-foreground/70 focus:border-foreground";

const leadSchema = z.object({
  name: z.string().trim().min(1).max(120),
  business_name: z.string().trim().max(140),
  email: z.string().trim().email().max(255),
  services: z.array(z.string().max(60)).max(10),
  message: z.string().trim().min(1).max(2000),
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const parsed = leadSchema.safeParse({
      name: String(data.get("name") ?? ""),
      business_name: String(data.get("business") ?? ""),
      email: String(data.get("email") ?? ""),
      services: data.getAll("service").map(String),
      message: String(data.get("message") ?? ""),
    });

    if (!parsed.success) {
      setError("Please check your name, email and message and try again.");
      return;
    }

    setBusy(true);
    setError(null);
    const { error: insertError } = await supabase.from("leads").insert(parsed.data);
    setBusy(false);

    if (insertError) {
      setError("We couldn't send that. Please email admosaic1819@gmail.com instead.");
      return;
    }

    form.reset();
    setSent(true);
  }

  return (
    <>
      <section className="shell pt-20 pb-14 md:pt-28 md:pb-16">
        <Reveal>
          <Eyebrow>Contact</Eyebrow>
          <h1 className="display mt-8 max-w-4xl text-[clamp(2.75rem,8vw,6rem)]">
            Start a project.
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Tell us where your business is today and where you want it to go. We'll reply within
            two business days.
          </p>
        </Reveal>
      </section>

      <Section className="pt-4">
        <div className="shell grid gap-16 lg:grid-cols-[1.15fr_0.85fr]">
          <Reveal>
            <form onSubmit={onSubmit} className="space-y-10">
              <div className="grid gap-8 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="eyebrow text-muted-foreground">
                    Name
                  </label>
                  <input id="name" name="name" required className={`${field} mt-3`} placeholder="Your name" />
                </div>
                <div>
                  <label htmlFor="business" className="eyebrow text-muted-foreground">
                    Business
                  </label>
                  <input id="business" name="business" className={`${field} mt-3`} placeholder="Business name" />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="eyebrow text-muted-foreground">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className={`${field} mt-3`}
                  placeholder="you@business.com"
                />
              </div>

              <fieldset>
                <legend className="eyebrow text-muted-foreground">What do you need?</legend>
                <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
                  {services.map((s) => (
                    <label key={s.to} className="flex items-center gap-2.5 text-sm">
                      <input
                        type="checkbox"
                        name="service"
                        value={s.name}
                        className="size-4 accent-[var(--accent)]"
                      />
                      {s.name}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div>
                <label htmlFor="message" className="eyebrow text-muted-foreground">
                  Project
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className={`${field} mt-3 resize-none`}
                  placeholder="A few lines about your business and what you're trying to achieve."
                />
              </div>

              <button
                type="submit"
                disabled={busy}
                className="group inline-flex items-center gap-2.5 bg-ink px-6 py-3.5 text-sm font-medium text-ink-foreground transition-colors duration-200 hover:bg-accent hover:text-accent-foreground"
              >
                {busy ? "Sending…" : "Send enquiry"} <Arrow />
              </button>

              <p aria-live="polite" className="text-sm text-muted-foreground">
                {error ?? (sent ? "Thanks — we've received your enquiry and will reply within two business days." : null)}
              </p>
            </form>
          </Reveal>

          <Reveal delay={80} className="space-y-10">
            <div>
              <h2 className="eyebrow text-muted-foreground">Email</h2>
              <a
                href="mailto:admosaic1819@gmail.com"
                className="mt-3 block text-lg transition-colors duration-200 hover:text-accent"
              >
                admosaic1819@gmail.com
              </a>
            </div>
            <div>
              <h2 className="eyebrow text-muted-foreground">Instagram</h2>
              <a
                href="https://instagram.com/admosaicmarketing"
                target="_blank"
                rel="noreferrer noopener"
                className="mt-3 block text-lg transition-colors duration-200 hover:text-accent"
              >
                @admosaicmarketing
              </a>
            </div>
            <div>
              <h2 className="eyebrow text-muted-foreground">Based in</h2>
              <p className="mt-3 text-lg">
                Edmonton, Alberta
                <br />
                Canada
              </p>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
