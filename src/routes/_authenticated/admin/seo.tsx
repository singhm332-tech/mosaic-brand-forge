import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminPage } from "@/components/admin/kit";

export const Route = createFileRoute("/_authenticated/admin/seo")({
  component: SeoPage,
});

function score(value: string | null, max: number) {
  if (!value) return { label: "Missing", tone: "text-destructive" };
  if (value.length > max) return { label: `${value.length} characters — too long`, tone: "text-amber-600" };
  return { label: `${value.length} characters`, tone: "text-muted-foreground" };
}

function SeoPage() {
  const { data: projects = [] } = useQuery({
    queryKey: ["seo-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("id, title, slug, seo_title, seo_description, status")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { data: services = [] } = useQuery({
    queryKey: ["seo-services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("id, name, slug, seo_title, seo_description")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  return (
    <AdminPage
      title="SEO"
      description="Search titles and descriptions. Edit them on each project or service."
    >
      <section>
        <h2 className="text-sm font-semibold">Services</h2>
        <div className="mt-4 divide-y divide-border rounded-md border border-border">
          {services.map((item) => (
            <div key={item.id} className="px-4 py-3">
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-xs text-muted-foreground">/{item.slug}</p>
              <p className={`mt-2 text-xs ${score(item.seo_title, 60).tone}`}>
                Title: {score(item.seo_title, 60).label}
              </p>
              <p className={`text-xs ${score(item.seo_description, 160).tone}`}>
                Description: {score(item.seo_description, 160).label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold">Projects</h2>
        <div className="mt-4 divide-y divide-border rounded-md border border-border">
          {projects.length === 0 && (
            <p className="px-4 py-6 text-sm text-muted-foreground">No projects yet.</p>
          )}
          {projects.map((item) => (
            <div key={item.id} className="px-4 py-3">
              <p className="text-sm font-medium">{item.title}</p>
              <p className="text-xs text-muted-foreground">/work/{item.slug}</p>
              <p className={`mt-2 text-xs ${score(item.seo_title, 60).tone}`}>
                Title: {score(item.seo_title, 60).label}
              </p>
              <p className={`text-xs ${score(item.seo_description, 160).tone}`}>
                Description: {score(item.seo_description, 160).label}
              </p>
            </div>
          ))}
        </div>
      </section>
    </AdminPage>
  );
}
