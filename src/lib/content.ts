import { getRouteApi } from "@tanstack/react-router";

const rootApi = getRouteApi("__root__");

export type SiteContent = Record<string, string>;

/**
 * Reads editable website text/images saved in the admin area.
 * Any empty or missing value falls back to the built-in content.
 */
export function useSiteContent() {
  const data = rootApi.useLoaderData() as { siteContent?: SiteContent } | undefined;
  const map = data?.siteContent ?? {};

  const get = (key: string, fallback: string) => {
    const value = map[key];
    return value && value.trim().length > 0 ? value.trim() : fallback;
  };

  return { get, map };
}
