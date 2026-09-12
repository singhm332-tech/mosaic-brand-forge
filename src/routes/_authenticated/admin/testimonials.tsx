import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  AdminPage,
  Button,
  ConfirmDelete,
  EmptyState,
  Field,
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

export const Route = createFileRoute("/_authenticated/admin/testimonials")({
  component: TestimonialsPage,
});

type TestimonialRow = {
  id: string;
  client_name: string;
  business_name: string | null;
  quote: string;
  google_review_url: string | null;
  rating: number | null;
  featured: boolean;
  display_order: number;
  status: "draft" | "published";
};

const blank = {
  client_name: "",
  business_name: "",
  quote: "",
  google_review_url: "",
  display_order: 0,
  featured: false,
  status: "draft" as "draft" | "published",
};

function TestimonialsPage() {
  const { list, save, remove } = useResource<TestimonialRow>("testimonials", {
    orderBy: "display_order",
    ascending: true,
    labelKey: "client_name",
  });
  const [editing, setEditing] = useState<(typeof blank & { id?: string }) | null>(null);

  return (
    <AdminPage
      title="Testimonials"
      description="Only published testimonials appear on the website."
      actions={<Button onClick={() => setEditing({ ...blank })}>New testimonial</Button>}
    >
      {!list.isLoading && (list.data?.length ?? 0) === 0 && (
        <EmptyState>No testimonials yet. Nothing is shown on the site until you add one.</EmptyState>
      )}

      <div className="divide-y divide-border rounded-md border border-border">
        {list.data?.map((item) => (
          <div key={item.id} className="flex items-start gap-4 px-4 py-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">
                {item.client_name}
                {item.business_name ? ` — ${item.business_name}` : ""}
              </p>
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{item.quote}</p>
            </div>
            <StatusPill status={item.status} />
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setEditing({
                  id: item.id,
                  client_name: item.client_name,
                  business_name: item.business_name ?? "",
                  quote: item.quote,
                  google_review_url: item.google_review_url ?? "",
                  display_order: item.display_order,
                  featured: item.featured,
                  status: item.status,
                })
              }
            >
              Edit
            </Button>
            <ConfirmDelete
              label={item.client_name}
              onConfirm={() => remove.mutate({ id: item.id, label: item.client_name })}
            />
          </div>
        ))}
      </div>

      <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-h-[85vh] max-w-xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Edit testimonial" : "New testimonial"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-5">
              <Field label="Client name">
                <Input
                  value={editing.client_name}
                  maxLength={120}
                  onChange={(e) => setEditing({ ...editing, client_name: e.target.value })}
                />
              </Field>
              <Field label="Business name">
                <Input
                  value={editing.business_name}
                  maxLength={140}
                  onChange={(e) => setEditing({ ...editing, business_name: e.target.value })}
                />
              </Field>
              <Field label="Quote">
                <Textarea
                  rows={4}
                  maxLength={1000}
                  value={editing.quote}
                  onChange={(e) => setEditing({ ...editing, quote: e.target.value })}
                />
              </Field>
              <Field label="Google review link">
                <Input
                  value={editing.google_review_url}
                  maxLength={300}
                  placeholder="https://"
                  onChange={(e) => setEditing({ ...editing, google_review_url: e.target.value })}
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
                    id="t-status"
                    checked={editing.status === "published"}
                    onCheckedChange={(v) =>
                      setEditing({ ...editing, status: v ? "published" : "draft" })
                    }
                  />
                  <Label htmlFor="t-status">Published</Label>
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
                if (!editing || !editing.client_name.trim() || !editing.quote.trim()) return;
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
