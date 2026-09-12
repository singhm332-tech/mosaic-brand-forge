import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

function publicClient() {
  return createClient<Database>(
    process.env["SUPABASE_URL"]!,
    process.env["SUPABASE_PUBLISHABLE_KEY"]!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
}

export type PublicProject = {
  slug: string;
  client: string;
  disciplines: string[];
  description: string;
  image: string;
  alt: string;
  size: "wide" | "half";
  featured: boolean;
};

export type PublicReel = {
  client: string;
  instagramUrl?: string | undefined;
  cover: string;
  alt: string;
};

export type PublicTestimonial = { quote: string; name: string; role: string };

/** Published projects, newest ordering first. Empty array means "use built-in content". */
export const getPublicProjects = createServerFn({ method: "GET" }).handler(
  async (): Promise<PublicProject[]> => {
    const { data, error } = await publicClient()
      .from("projects")
      .select(
        "slug, title, client_name, short_description, services, cover_image_url, cover_image_alt, featured, display_order",
      )
      .eq("status", "published")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error || !data) return [];

    return data
      .filter((row) => Boolean(row.cover_image_url))
      .map((row, index) => ({
        slug: row.slug,
        client: row.client_name || row.title,
        disciplines: row.services ?? [],
        description: row.short_description ?? "",
        image: row.cover_image_url!,
        alt: row.cover_image_alt ?? row.title,
        size: index === 0 || row.featured ? ("wide" as const) : ("half" as const),
        featured: row.featured,
      }));
  },
);

export const getPublicReels = createServerFn({ method: "GET" }).handler(
  async (): Promise<PublicReel[]> => {
    const { data, error } = await publicClient()
      .from("reels")
      .select("client_name, title, instagram_url, thumbnail_url, thumbnail_alt, display_order")
      .eq("status", "published")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error || !data) return [];

    return data.map((row) => ({
      client: row.client_name || row.title || "Client",
      instagramUrl: row.instagram_url || undefined,
      cover: row.thumbnail_url || "",
      alt: row.thumbnail_alt || `${row.client_name ?? "Client"} Instagram Reel`,
    }));
  },
);

export const getPublicTestimonials = createServerFn({ method: "GET" }).handler(
  async (): Promise<PublicTestimonial[]> => {
    const { data, error } = await publicClient()
      .from("testimonials")
      .select("client_name, business_name, quote, display_order")
      .eq("status", "published")
      .order("display_order", { ascending: true });

    if (error || !data) return [];

    return data.map((row) => ({
      quote: row.quote,
      name: row.client_name,
      role: row.business_name ?? "",
    }));
  },
);

export const getSiteContent = createServerFn({ method: "GET" }).handler(
  async (): Promise<Record<string, string>> => {
    const { data, error } = await publicClient().from("site_content").select("key, value");
    if (error || !data) return {};
    return Object.fromEntries(data.map((row) => [row.key, row.value]));
  },
);
