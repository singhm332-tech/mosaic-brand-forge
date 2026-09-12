import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { deleteMedia, uploadMedia } from "@/lib/admin";
import { AdminPage, Button, ConfirmDelete, EmptyState, Input } from "@/components/admin/kit";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/media")({
  component: MediaPage,
});

function MediaPage() {
  const queryClient = useQueryClient();

  const { data: assets = [], isLoading } = useQuery({
    queryKey: ["media-assets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("media_assets")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const upload = useMutation({
    mutationFn: async (files: FileList) => {
      for (const file of Array.from(files)) await uploadMedia(file);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media-assets"] });
      toast.success("Upload complete.");
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Upload failed."),
  });

  const updateAlt = useMutation({
    mutationFn: async ({ id, alt }: { id: string; alt: string }) => {
      const { error } = await supabase.from("media_assets").update({ alt_text: alt }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["media-assets"] }),
  });

  const removeAsset = useMutation({
    mutationFn: ({ id, path, label }: { id: string; path: string; label: string }) =>
      deleteMedia(id, path, label),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media-assets"] });
      toast.success("Deleted.");
    },
  });

  return (
    <AdminPage title="Images & Media" description="Every image used across the website.">
      <div className="rounded-md border border-dashed border-border p-5">
        <Input
          type="file"
          accept="image/*,video/*"
          multiple
          disabled={upload.isPending}
          onChange={(e) => e.target.files && upload.mutate(e.target.files)}
        />
        <p className="mt-2 text-xs text-muted-foreground">Up to 50 MB per file.</p>
      </div>

      {isLoading && <p className="mt-8 text-sm text-muted-foreground">Loading…</p>}
      {!isLoading && assets.length === 0 && (
        <div className="mt-8">
          <EmptyState>No files uploaded yet.</EmptyState>
        </div>
      )}

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {assets.map((asset) => (
          <div key={asset.id} className="rounded-md border border-border p-3">
            <div className="aspect-4/3 overflow-hidden rounded bg-muted">
              <img src={asset.public_url} alt={asset.alt_text ?? ""} className="h-full w-full object-cover" />
            </div>
            <p className="mt-3 truncate text-xs font-medium">{asset.file_name}</p>
            <Input
              className="mt-2 h-8 text-xs"
              defaultValue={asset.alt_text ?? ""}
              placeholder="Image description"
              onBlur={(e) => updateAlt.mutate({ id: asset.id, alt: e.target.value })}
            />
            <div className="mt-2 flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  void navigator.clipboard.writeText(asset.public_url);
                  toast.success("Link copied.");
                }}
              >
                Copy link
              </Button>
              <ConfirmDelete
                label={asset.file_name}
                onConfirm={() =>
                  removeAsset.mutate({
                    id: asset.id,
                    path: asset.storage_path,
                    label: asset.file_name,
                  })
                }
              />
            </div>
          </div>
        ))}
      </div>
    </AdminPage>
  );
}
