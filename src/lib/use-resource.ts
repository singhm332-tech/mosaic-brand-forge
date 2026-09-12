import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { logActivity } from "@/lib/admin";
import { toast } from "sonner";

type TableName = "projects" | "reels" | "testimonials" | "services" | "leads" | "media_assets";

export function useResource<Row extends { id: string }>(
  table: TableName,
  options?: { orderBy?: string; ascending?: boolean; labelKey?: string },
) {
  const queryClient = useQueryClient();
  const key = [table];
  const orderBy = options?.orderBy ?? "created_at";
  const ascending = options?.ascending ?? false;
  const labelKey = options?.labelKey ?? "title";

  const list = useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .order(orderBy, { ascending })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as Row[];
    },
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: key });

  const save = useMutation({
    mutationFn: async (values: Record<string, unknown> & { id?: string }) => {
      const { id, ...rest } = values;
      if (id) {
        const { data, error } = await supabase
          .from(table)
          .update(rest as never)
          .eq("id", id)
          .select()
          .single();
        if (error) throw error;
        await logActivity("updated", table, id, String((data as never as Record<string, unknown>)[labelKey] ?? ""));
        return data;
      }
      const { data, error } = await supabase
        .from(table)
        .insert(rest as never)
        .select()
        .single();
      if (error) throw error;
      const row = data as never as Record<string, unknown>;
      await logActivity("created", table, String(row["id"]), String(row[labelKey] ?? ""));
      return data;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Saved.");
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Could not save."),
  });

  const remove = useMutation({
    mutationFn: async ({ id, label }: { id: string; label: string }) => {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
      await logActivity("deleted", table, id, label);
    },
    onSuccess: () => {
      invalidate();
      toast.success("Deleted.");
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Could not delete."),
  });

  return { list, save, remove, invalidate };
}
