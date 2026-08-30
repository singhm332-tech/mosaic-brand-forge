import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { to: "/services", label: "Services" },
  { to: "/work", label: "Work" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("text-[0.95rem] font-medium tracking-[0.22em] uppercase", className)}>
      Ad<span className="text-accent">·</span>Mosaic
    </span>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-colors duration-300",
        scrolled ? "bg-background/90 backdrop-blur-sm border-b border-border" : "bg-transparent",
      )}
    >
      <div className="shell flex h-[72px] items-center justify-between">
        <Link to="/" className="flex items-center" aria-label="AdMosaic Marketing — home">
          <Wordmark />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-9 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/contact"
            className="group inline-flex items-center gap-2 bg-ink px-5 py-2.5 text-sm font-medium text-ink-foreground transition-colors duration-200 hover:bg-accent hover:text-accent-foreground"
          >
            Start a Project
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex h-10 w-10 items-center justify-center md:hidden"
        >
          <span className="relative block h-3 w-6">
            <span
              className={cn(
                "absolute left-0 block h-px w-6 bg-foreground transition-transform duration-200",
                open ? "top-1.5 rotate-45" : "top-0",
              )}
            />
            <span
              className={cn(
                "absolute left-0 block h-px w-6 bg-foreground transition-transform duration-200",
                open ? "top-1.5 -rotate-45" : "top-3",
              )}
            />
          </span>
        </button>
      </div>

      {open ? (
        <div className="fixed inset-x-0 top-[72px] bottom-0 z-40 bg-background md:hidden">
          <nav aria-label="Mobile" className="shell flex flex-col gap-1 pt-8">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="display border-b border-border py-5 text-4xl"
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="mt-8 inline-flex items-center justify-center bg-ink px-6 py-4 text-sm font-medium text-ink-foreground"
            >
              Start a Project
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
