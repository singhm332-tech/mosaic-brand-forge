import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { logActivity } from "@/lib/admin";
import { AdminPage, Button, ImageField, Input, Textarea } from "@/components/admin/kit";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/content")({
  component: ContentPage,
});

type ContentRow = {
  key: string;
  value: string;
  label: string | null;
  group_name: string;
  page: string;
  field_type: string;
  multiline: boolean;
  display_order: number;
};

const PAGE_ORDER = ["Homepage", "About", "Contact", "Site-wide"];

function ContentPage() {
  const queryClient = useQueryClient();
  const [values, setValues] = useState<Record<string, string>>({});
  const [activePage, setActivePage] = useState<string | null>(null);

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["site-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_content")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data as unknown as ContentRow[];
    },
  });

  useEffect(() => {
    if (rows.length) setValues(Object.fromEntries(rows.map((r) => [r.key, r.value])));
  }, [rows]);

  const pages = useMemo(() => {
    const found = Array.from(new Set(rows.map((r) => r.page)));
    return found.sort((a, b) => {
      const ai = PAGE_ORDER.indexOf(a);
      const bi = PAGE_ORDER.indexOf(b);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });
  }, [rows]);

  const currentPage = activePage ?? pages[0] ?? null;
  const pageRows = rows.filter((r) => r.page === currentPage);
  const sections = Array.from(new Set(pageRows.map((r) => r.group_name)));

  const dirtyCount = rows.filter(
    (row) => values[row.key] !== undefined && values[row.key] !== row.value,
  ).length;

  const save = useMutation({
    mutationFn: async () => {
      const changed = rows.filter(
        (row) => values[row.key] !== undefined && values[row.key] !== row.value,
      );
      for (const row of changed) {
        const { error } = await supabase
          .from("site_content")
          .update({ value: values[row.key]! })
          .eq("key", row.key);
        if (error) throw error;
      }
      if (changed.length) {
        await logActivity("updated", "site_content", null, `${changed.length} website change(s)`);
      }
      return changed.length;
    },
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ["site-content"] });
      toast.success(count ? "Website updated." : "Nothing to save.");
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Could not save."),
  });

  const set = (key: string, value: string) => setValues((prev) => ({ ...prev, [key]: value }));

  return (
    <AdminPage
      title="Website Pages"
      description="Choose a page, then edit its wording or swap any picture. Leave a field empty to keep the original."
      actions={
        <Button disabled={save.isPending || dirtyCount === 0} onClick={() => save.mutate()}>
          {dirtyCount > 0 ? `Save ${dirtyCount} change${dirtyCount > 1 ? "s" : ""}` : "Save changes"}
        </Button>
      }
    >
      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}

      {pages.length > 0 && (
        <div className="flex flex-wrap gap-2 border-b border-border pb-4">
          {pages.map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => setActivePage(page)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm transition-colors",
                page === currentPage
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:border-foreground/50",
              )}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      <div className="mt-8 space-y-10">
        {sections.map((section) => (
          <section key={section}>
            <h2 className="text-sm font-semibold tracking-tight">{section}</h2>
            <div className="mt-4 space-y-6 rounded-md border border-border p-5">
              {pageRows
                .filter((row) => row.group_name === section)
                .map((row) =>
                  row.field_type === "image" ? (
                    <ImageField
                      key={row.key}
                      label={row.label ?? row.key}
                      value={values[row.key] ?? ""}
                      onChange={(url) => set(row.key, url)}
                      hint="Upload a new picture or pick one from the library. Empty keeps the current design image."
                    />
                  ) : (
                    <div key={row.key} className="space-y-2">
                      <Label htmlFor={row.key}>{row.label ?? row.key}</Label>
                      {row.field_type === "textarea" || row.multiline ? (
                        <Textarea
                          id={row.key}
                          rows={4}
                          maxLength={2000}
                          value={values[row.key] ?? ""}
                          onChange={(e) => set(row.key, e.target.value)}
                        />
                      ) : (
                        <Input
                          id={row.key}
                          maxLength={300}
                          value={values[row.key] ?? ""}
                          onChange={(e) => set(row.key, e.target.value)}
                        />
                      )}
                    </div>
                  ),
                )}
            </div>
          </section>
        ))}
      </div>
    </AdminPage>
  );
}
