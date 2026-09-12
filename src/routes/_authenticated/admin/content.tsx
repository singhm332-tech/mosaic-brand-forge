import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { logActivity } from "@/lib/admin";
import { AdminPage, Button, Input, Textarea } from "@/components/admin/kit";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/content")({
  component: ContentPage,
});

function ContentPage() {
  const queryClient = useQueryClient();
  const [values, setValues] = useState<Record<string, string>>({});

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["site-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_content")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (rows.length) setValues(Object.fromEntries(rows.map((r) => [r.key, r.value])));
  }, [rows]);

  const save = useMutation({
    mutationFn: async () => {
      const changed = rows.filter((row) => values[row.key] !== undefined && values[row.key] !== row.value);
      for (const row of changed) {
        const { error } = await supabase
          .from("site_content")
          .update({ value: values[row.key]! })
          .eq("key", row.key);
        if (error) throw error;
      }
      if (changed.length) {
        await logActivity("updated", "site_content", null, `${changed.length} text change(s)`);
      }
      return changed.length;
    },
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ["site-content"] });
      toast.success(count ? "Website text updated." : "Nothing to save.");
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Could not save."),
  });

  const groups = Array.from(new Set(rows.map((r) => r.group_name)));

  return (
    <AdminPage
      title="Website Content"
      description="Headlines and text used across the public pages."
      actions={
        <Button disabled={save.isPending} onClick={() => save.mutate()}>
          Save changes
        </Button>
      }
    >
      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}

      <div className="space-y-10">
        {groups.map((group) => (
          <section key={group}>
            <h2 className="text-sm font-semibold tracking-tight">{group}</h2>
            <div className="mt-4 space-y-5 rounded-md border border-border p-5">
              {rows
                .filter((row) => row.group_name === group)
                .map((row) => (
                  <div key={row.key} className="space-y-2">
                    <Label htmlFor={row.key}>{row.label ?? row.key}</Label>
                    {row.multiline ? (
                      <Textarea
                        id={row.key}
                        rows={3}
                        maxLength={2000}
                        value={values[row.key] ?? ""}
                        onChange={(e) => setValues({ ...values, [row.key]: e.target.value })}
                      />
                    ) : (
                      <Input
                        id={row.key}
                        maxLength={300}
                        value={values[row.key] ?? ""}
                        onChange={(e) => setValues({ ...values, [row.key]: e.target.value })}
                      />
                    )}
                  </div>
                ))}
            </div>
          </section>
        ))}
      </div>
    </AdminPage>
  );
}
