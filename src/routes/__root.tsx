import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Nav } from "../components/site/Nav";
import { Footer } from "../components/site/Footer";
import { Toaster } from "../components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="shell flex min-h-[70vh] flex-col justify-center py-24">
      <p className="eyebrow text-muted-foreground">404</p>
      <h1 className="display mt-6 text-[clamp(2.5rem,7vw,5rem)]">This page doesn't exist.</h1>
      <p className="mt-6 max-w-md text-muted-foreground">
        The page may have moved. Head back to the homepage or get in touch.
      </p>
      <div className="mt-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-ink px-6 py-3 text-sm font-medium text-ink-foreground transition-colors duration-200 hover:bg-accent hover:text-accent-foreground"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="shell flex min-h-[70vh] flex-col justify-center py-24">
      <h1 className="display text-4xl">This page didn't load</h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        Something went wrong on our end. Try again or head back home.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="bg-ink px-6 py-3 text-sm font-medium text-ink-foreground"
        >
          Try again
        </button>
        <a href="/" className="border border-border px-6 py-3 text-sm font-medium">
          Go home
        </a>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "AdMosaic Marketing — Edmonton Marketing Agency" },
      {
        name: "description",
        content:
          "AdMosaic is an Edmonton marketing agency combining digital strategy, design and local marketing.",
      },
      { property: "og:site_name", content: "AdMosaic Marketing" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_CA" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#f7f4ee" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter+Tight:wght@300;400;500;600&display=swap",
      },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: "AdMosaic Marketing",
          description:
            "Edmonton marketing agency offering social media marketing, website design and SEO, solo flyer campaigns, NFC review cards and graphic design.",
          areaServed: "Edmonton, Alberta, Canada",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Edmonton",
            addressRegion: "AB",
            addressCountry: "CA",
          },
          email: "hello@admosaicmarketing.com",
          sameAs: ["https://instagram.com/admosaicmarketing"],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isPrivateArea =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/reset-password");

  if (isPrivateArea) {
    return (
      <QueryClientProvider client={queryClient}>
        <Outlet />
        <Toaster />
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-ink-foreground"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main">
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
      </main>
      <Footer />
      <Toaster />
    </QueryClientProvider>
  );
}
