import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { logActivity } from "@/lib/admin";
import { AdminPage, ConfirmDelete, EmptyState } from "@/components/admin/kit";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/leads")({
  component: LeadsPage,
});

const statuses = ["new", "contacted", "follow_up", "won", "lost", "archived"] as const;

function LeadsPage() {
  const queryClient = useQueryClient();

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const setStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: (typeof statuses)[number] }) => {
      const { error } = await supabase.from("leads").update({ status }).eq("id", id);
      if (error) throw error;
      await logActivity("updated", "leads", id, status);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["leads"] }),
  });

  const remove = useMutation({
    mutationFn: async ({ id, label }: { id: string; label: string }) => {
      const { error } = await supabase.from("leads").delete().eq("id", id);
      if (error) throw error;
      await logActivity("deleted", "leads", id, label);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Enquiry deleted.");
    },
  });

  return (
    <AdminPage title="Contact Leads" description="Enquiries submitted through the contact form.">
      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
      {!isLoading && leads.length === 0 && <EmptyState>No enquiries yet.</EmptyState>}

      <div className="space-y-4">
        {leads.map((lead) => (
          <article key={lead.id} className="rounded-md border border-border p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-medium">
                  {lead.name}
                  {lead.business_name ? ` — ${lead.business_name}` : ""}
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  <a href={`mailto:${lead.email}`} className="underline underline-offset-4">
                    {lead.email}
                  </a>
                  {lead.phone ? ` · ${lead.phone}` : ""} ·{" "}
                  {new Date(lead.created_at).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={lead.status}
                  onValueChange={(value) =>
                    setStatus.mutate({ id: lead.id, status: value as (typeof statuses)[number] })
                  }
                >
                  <SelectTrigger className="h-8 w-36 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status} className="capitalize">
                        {status.replace("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <ConfirmDelete
                  label={lead.name}
                  onConfirm={() => remove.mutate({ id: lead.id, label: lead.name })}
                />
              </div>
            </div>
            {lead.services.length > 0 && (
              <p className="mt-3 text-xs text-muted-foreground">
                Interested in: {lead.services.join(", ")}
              </p>
            )}
            {lead.message && <p className="mt-3 text-sm whitespace-pre-line">{lead.message}</p>}
          </article>
        ))}
      </div>
    </AdminPage>
  );
}
