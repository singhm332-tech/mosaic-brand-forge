import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminPage, EmptyState } from "@/components/admin/kit";

export const Route = createFileRoute("/_authenticated/admin/activity")({
  component: ActivityPage,
});

function ActivityPage() {
  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["activity-log"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("activity_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return data;
    },
  });

  return (
    <AdminPage title="Activity Log" description="Recent changes made in this dashboard.">
      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
      {!isLoading && entries.length === 0 && <EmptyState>No activity recorded yet.</EmptyState>}

      <div className="divide-y divide-border rounded-md border border-border">
        {entries.map((entry) => (
          <div key={entry.id} className="flex flex-wrap items-baseline justify-between gap-2 px-4 py-3">
            <p className="text-sm">
              <span className="font-medium">{entry.actor_email ?? "Someone"}</span> {entry.action}{" "}
              {entry.entity_type.replace("_", " ")}
              {entry.entity_label ? ` “${entry.entity_label}”` : ""}
            </p>
            <p className="text-xs text-muted-foreground">
              {new Date(entry.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </AdminPage>
  );
}
