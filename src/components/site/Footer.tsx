import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

const services = [
  { to: "/social-media-marketing", label: "Social Media" },
  { to: "/web-design-seo", label: "Websites & SEO" },
  { to: "/flyer-campaigns", label: "Flyer Campaigns" },
  { to: "/nfc-review-cards", label: "NFC & Reputation" },
  { to: "/graphic-design", label: "Graphic Design" },
] as const;

const company = [
  { to: "/work", label: "Work" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/services", label: "Services" },
] as const;

export function Footer() {
  return (
    <footer className="bg-ink text-ink-foreground">
      <div className="shell pt-24 pb-12">
        <div className="grid gap-14 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div>
            <Link
              to="/"
              aria-label="AdMosaic Marketing — home"
              className="inline-flex bg-ivory px-3 py-2"
            >
              <Logo className="h-12 w-[195px]" />
            </Link>
            <p className="eyebrow text-ink-muted">Edmonton, Alberta — Canada</p>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-ink-muted">
              A marketing agency for businesses that want their brand to look the part —
              online and offline.
            </p>
          </div>

          <nav aria-label="Services">
            <h2 className="eyebrow text-ink-muted">Services</h2>
            <ul className="mt-6 space-y-3">
              {services.map((s) => (
                <li key={s.to}>
                  <Link
                    to={s.to}
                    className="text-sm text-ink-foreground/80 transition-colors duration-200 hover:text-accent"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company">
            <h2 className="eyebrow text-ink-muted">Company</h2>
            <ul className="mt-6 space-y-3">
              {company.map((s) => (
                <li key={s.to}>
                  <Link
                    to={s.to}
                    className="text-sm text-ink-foreground/80 transition-colors duration-200 hover:text-accent"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="eyebrow text-ink-muted">Elsewhere</h2>
            <ul className="mt-6 space-y-3">
              <li>
                <a
                  href="https://instagram.com/admosaicmarketing"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-sm text-ink-foreground/80 transition-colors duration-200 hover:text-accent"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="mailto:admosaic1819@gmail.com"
                  className="text-sm text-ink-foreground/80 transition-colors duration-200 hover:text-accent"
                >
                  admosaic1819@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-3 border-t border-ink-border pt-6 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright © {new Date().getFullYear()} AdMosaic Marketing</p>
          <p>Edmonton, Alberta — Canada</p>
        </div>
      </div>
    </footer>
  );
}
