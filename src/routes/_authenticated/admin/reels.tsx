import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  AdminPage,
  Button,
  ConfirmDelete,
  EmptyState,
  Field,
  ImageField,
  Input,
  StatusPill,
  Textarea,
} from "@/components/admin/kit";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useResource } from "@/lib/use-resource";

export const Route = createFileRoute("/_authenticated/admin/reels")({
  component: ReelsPage,
});

type ReelRow = {
  id: string;
  client_name: string | null;
  instagram_url: string;
  title: string | null;
  description: string | null;
  thumbnail_url: string | null;
  thumbnail_alt: string | null;
  category: string | null;
  display_order: number;
  featured: boolean;
  status: "draft" | "published";
};

const blank = {
  client_name: "",
  instagram_url: "",
  title: "",
  description: "",
  thumbnail_url: "",
  thumbnail_alt: "",
  display_order: 0,
  featured: false,
  status: "draft" as "draft" | "published",
};

function ReelsPage() {
  const { list, save, remove } = useResource<ReelRow>("reels", {
    orderBy: "display_order",
    ascending: true,
    labelKey: "client_name",
  });
  const [editing, setEditing] = useState<(typeof blank & { id?: string }) | null>(null);

  return (
    <AdminPage
      title="Social Media / Reels"
      description="The Reel showcase on the Social Media Marketing page."
      actions={<Button onClick={() => setEditing({ ...blank })}>New reel</Button>}
    >
      {!list.isLoading && (list.data?.length ?? 0) === 0 && (
        <EmptyState>
          No reels yet. The page keeps showing its built-in placeholders until you publish one.
        </EmptyState>
      )}

      <div className="divide-y divide-border rounded-md border border-border">
        {list.data?.map((reel) => (
          <div key={reel.id} className="flex items-center gap-4 px-4 py-3">
            <div className="h-16 w-9 shrink-0 overflow-hidden rounded bg-muted">
              {reel.thumbnail_url && (
                <img src={reel.thumbnail_url} alt="" className="h-full w-full object-cover" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{reel.client_name || "Untitled"}</p>
              <p className="truncate text-xs text-muted-foreground">{reel.instagram_url}</p>
            </div>
            <StatusPill status={reel.status} />
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setEditing({
                  id: reel.id,
                  client_name: reel.client_name ?? "",
                  instagram_url: reel.instagram_url,
                  title: reel.title ?? "",
                  description: reel.description ?? "",
                  thumbnail_url: reel.thumbnail_url ?? "",
                  thumbnail_alt: reel.thumbnail_alt ?? "",
                  display_order: reel.display_order,
                  featured: reel.featured,
                  status: reel.status,
                })
              }
            >
              Edit
            </Button>
            <ConfirmDelete
              label={reel.client_name ?? "reel"}
              onConfirm={() => remove.mutate({ id: reel.id, label: reel.client_name ?? "reel" })}
            />
          </div>
        ))}
      </div>

      <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-h-[85vh] max-w-xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Edit reel" : "New reel"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-5">
              <Field label="Client business name">
                <Input
                  value={editing.client_name}
                  maxLength={140}
                  onChange={(e) => setEditing({ ...editing, client_name: e.target.value })}
                />
              </Field>
              <Field
                label="Instagram Reel link"
                hint="Paste the full link, e.g. https://www.instagram.com/reel/XXXXXXX/"
              >
                <Input
                  value={editing.instagram_url}
                  maxLength={300}
                  onChange={(e) => setEditing({ ...editing, instagram_url: e.target.value })}
                />
              </Field>
              <ImageField
                label="Cover image"
                hint="Optional. Used only if the Instagram link can't be embedded."
                value={editing.thumbnail_url}
                onChange={(url) => setEditing({ ...editing, thumbnail_url: url })}
              />
              <Field label="Cover image description">
                <Input
                  value={editing.thumbnail_alt}
                  maxLength={200}
                  onChange={(e) => setEditing({ ...editing, thumbnail_alt: e.target.value })}
                />
              </Field>
              <Field label="Notes">
                <Textarea
                  rows={3}
                  maxLength={600}
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                />
              </Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Order">
                  <Input
                    type="number"
                    value={editing.display_order}
                    onChange={(e) =>
                      setEditing({ ...editing, display_order: Number(e.target.value) || 0 })
                    }
                  />
                </Field>
                <div className="flex items-center gap-3 pt-7">
                  <Switch
                    id="reel-status"
                    checked={editing.status === "published"}
                    onCheckedChange={(v) =>
                      setEditing({ ...editing, status: v ? "published" : "draft" })
                    }
                  />
                  <Label htmlFor="reel-status">Published</Label>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button
              disabled={save.isPending}
              onClick={() => {
                if (!editing || !editing.instagram_url.trim()) return;
                save.mutate({ ...editing }, { onSuccess: () => setEditing(null) });
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPage>
  );
}
