import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminPage } from "@/components/admin/kit";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: DashboardPage,
});

async function countOf(table: "projects" | "reels" | "testimonials" | "media_assets" | "leads", filter?: { column: string; value: string }) {
  let query = supabase.from(table).select("id", { count: "exact", head: true });
  if (filter) query = query.eq(filter.column, filter.value);
  const { count } = await query;
  return count ?? 0;
}

function DashboardPage() {
  const { data } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: async () => ({
      projects: await countOf("projects"),
      publishedProjects: await countOf("projects", { column: "status", value: "published" }),
      reels: await countOf("reels"),
      testimonials: await countOf("testimonials"),
      media: await countOf("media_assets"),
      newLeads: await countOf("leads", { column: "status", value: "new" }),
    }),
  });

  const { data: leads = [] } = useQuery({
    queryKey: ["admin-recent-leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("id, name, business_name, email, created_at, status")
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
  });

  const cards = [
    { label: "Projects", value: data?.projects, to: "/admin/projects" as const },
    { label: "Published projects", value: data?.publishedProjects, to: "/admin/projects" as const },
    { label: "Reels", value: data?.reels, to: "/admin/reels" as const },
    { label: "Testimonials", value: data?.testimonials, to: "/admin/testimonials" as const },
    { label: "Media files", value: data?.media, to: "/admin/media" as const },
    { label: "New leads", value: data?.newLeads, to: "/admin/leads" as const },
  ];

  return (
    <AdminPage title="Dashboard" description="A quick overview of your website content.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.to}
            className="rounded-md border border-border p-5 transition-colors hover:border-foreground/40"
          >
            <p className="text-sm text-muted-foreground">{card.label}</p>
            <p className="mt-2 text-3xl font-semibold tabular-nums">{card.value ?? "—"}</p>
          </Link>
        ))}
      </div>

      <section className="mt-12">
        <h2 className="text-sm font-semibold tracking-tight">Latest enquiries</h2>
        <div className="mt-4 divide-y divide-border rounded-md border border-border">
          {leads.length === 0 && (
            <p className="px-5 py-8 text-sm text-muted-foreground">No enquiries yet.</p>
          )}
          {leads.map((lead) => (
            <div key={lead.id} className="flex flex-wrap items-center justify-between gap-2 px-5 py-4">
              <div>
                <p className="text-sm font-medium">{lead.name}</p>
                <p className="text-xs text-muted-foreground">
                  {lead.business_name ? `${lead.business_name} — ` : ""}
                  {lead.email}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                {new Date(lead.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </section>
    </AdminPage>
  );
}
