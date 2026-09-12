import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  AdminPage,
  Button,
  EmptyState,
  Field,
  ImageField,
  Input,
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

export const Route = createFileRoute("/_authenticated/admin/services")({
  component: ServicesPage,
});

type ServiceRow = {
  id: string;
  slug: string;
  name: string;
  number_label: string;
  short_description: string | null;
  full_description: string | null;
  cover_image_url: string | null;
  cta_text: string | null;
  display_order: number;
  active: boolean;
  seo_title: string | null;
  seo_description: string | null;
};

type Draft = {
  id?: string;
  name: string;
  short_description: string;
  full_description: string;
  cover_image_url: string;
  cta_text: string;
  display_order: number;
  active: boolean;
  seo_title: string;
  seo_description: string;
};

function ServicesPage() {
  const { list, save } = useResource<ServiceRow>("services", {
    orderBy: "display_order",
    ascending: true,
    labelKey: "name",
  });
  const [editing, setEditing] = useState<Draft | null>(null);

  return (
    <AdminPage title="Services" description="The five services shown across the website.">
      {!list.isLoading && (list.data?.length ?? 0) === 0 && <EmptyState>No services found.</EmptyState>}

      <div className="divide-y divide-border rounded-md border border-border">
        {list.data?.map((service) => (
          <div key={service.id} className="flex items-center gap-4 px-4 py-3">
            <span className="text-xs text-muted-foreground tabular-nums">{service.number_label}</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{service.name}</p>
              <p className="truncate text-xs text-muted-foreground">{service.short_description}</p>
            </div>
            <span className="text-xs text-muted-foreground">{service.active ? "Live" : "Hidden"}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setEditing({
                  id: service.id,
                  name: service.name,
                  short_description: service.short_description ?? "",
                  full_description: service.full_description ?? "",
                  cover_image_url: service.cover_image_url ?? "",
                  cta_text: service.cta_text ?? "",
                  display_order: service.display_order,
                  active: service.active,
                  seo_title: service.seo_title ?? "",
                  seo_description: service.seo_description ?? "",
                })
              }
            >
              Edit
            </Button>
          </div>
        ))}
      </div>

      <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-h-[85vh] max-w-xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit service</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-5">
              <Field label="Name">
                <Input
                  value={editing.name}
                  maxLength={100}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                />
              </Field>
              <Field label="Short description">
                <Textarea
                  rows={3}
                  maxLength={400}
                  value={editing.short_description}
                  onChange={(e) => setEditing({ ...editing, short_description: e.target.value })}
                />
              </Field>
              <Field label="Full description">
                <Textarea
                  rows={5}
                  maxLength={4000}
                  value={editing.full_description}
                  onChange={(e) => setEditing({ ...editing, full_description: e.target.value })}
                />
              </Field>
              <ImageField
                label="Image"
                value={editing.cover_image_url}
                onChange={(url) => setEditing({ ...editing, cover_image_url: url })}
              />
              <Field label="Button text">
                <Input
                  value={editing.cta_text}
                  maxLength={60}
                  onChange={(e) => setEditing({ ...editing, cta_text: e.target.value })}
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
                    id="s-active"
                    checked={editing.active}
                    onCheckedChange={(v) => setEditing({ ...editing, active: v })}
                  />
                  <Label htmlFor="s-active">Show on website</Label>
                </div>
              </div>
              <Field label="Search title" hint="Under 60 characters.">
                <Input
                  value={editing.seo_title}
                  maxLength={70}
                  onChange={(e) => setEditing({ ...editing, seo_title: e.target.value })}
                />
              </Field>
              <Field label="Search description" hint="Under 160 characters.">
                <Textarea
                  rows={2}
                  maxLength={170}
                  value={editing.seo_description}
                  onChange={(e) => setEditing({ ...editing, seo_description: e.target.value })}
                />
              </Field>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button
              disabled={save.isPending}
              onClick={() => {
                if (!editing) return;
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
