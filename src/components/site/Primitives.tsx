import { Link } from "@tanstack/react-router";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("eyebrow text-muted-foreground", className)}>{children}</p>;
}

export function Section({
  children,
  className,
  tone = "light",
  id,
}: {
  children: ReactNode;
  className?: string;
  tone?: "light" | "sand" | "dark";
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "py-24 md:py-32",
        tone === "light" && "bg-background text-foreground",
        tone === "sand" && "bg-sand text-foreground",
        tone === "dark" && "bg-ink text-ink-foreground",
        className,
      )}
    >
      {children}
    </section>
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: "solid" | "outline" | "onDark" | "ghost";
};

const buttonBase =
  "group inline-flex items-center gap-2.5 px-6 py-3 text-sm font-medium tracking-tight transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export function ButtonLink({ variant = "solid", className, children, ...props }: ButtonLinkProps) {
  return (
    <Link
      {...props}
      className={cn(
        buttonBase,
        variant === "solid" && "bg-ink text-ink-foreground hover:bg-accent hover:text-accent-foreground",
        variant === "outline" && "border border-foreground/25 text-foreground hover:border-foreground/70",
        variant === "onDark" &&
          "bg-ink-foreground text-ink hover:bg-accent hover:text-accent-foreground",
        variant === "ghost" && "px-0 text-foreground hover:text-accent",
        className,
      )}
    >
      {children}
    </Link>
  );
}

/** Renders an admin-edited value when present, otherwise the built-in content. */
export function T({ value, children }: { value?: string; children: ReactNode }) {
  if (!value) return <>{children}</>;
  return <span className="whitespace-pre-line">{value}</span>;
}

/** Renders admin-edited copy as paragraphs, otherwise the built-in content. */
export function Copy({ value, children }: { value?: string; children: ReactNode }) {
  if (!value) return <>{children}</>;
  return (
    <>
      {value
        .split(/\n+/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line, i) => (
          <p key={i}>{line}</p>
        ))}
    </>
  );
}

export function Arrow({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block transition-transform duration-200 group-hover:translate-x-1",
        className,
      )}
    >
      →
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl", className)}>
      {eyebrow ? <Eyebrow className="mb-6">{eyebrow}</Eyebrow> : null}
      <h2 className="display text-[clamp(2.25rem,5.5vw,4rem)]">{title}</h2>
      {intro ? (
        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
          {intro}
        </p>
      ) : null}
    </div>
  );
}
