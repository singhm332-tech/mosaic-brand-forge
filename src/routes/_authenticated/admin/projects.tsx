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
import { slugify } from "@/lib/admin";

export const Route = createFileRoute("/_authenticated/admin/projects")({
  component: ProjectsPage,
});

type ProjectRow = {
  id: string;
  title: string;
  slug: string;
  client_name: string | null;
  category: string;
  short_description: string | null;
  full_description: string | null;
  services: string[];
  cover_image_url: string | null;
  cover_image_alt: string | null;
  website_url: string | null;
  featured: boolean;
  display_order: number;
  status: "draft" | "published";
  seo_title: string | null;
  seo_description: string | null;
};

const blank = {
  title: "",
  slug: "",
  client_name: "",
  category: "Other",
  short_description: "",
  full_description: "",
  services: [] as string[],
  cover_image_url: "",
  cover_image_alt: "",
  website_url: "",
  featured: false,
  display_order: 0,
  status: "draft" as "draft" | "published",
  seo_title: "",
  seo_description: "",
};

function ProjectsPage() {
  const { list, save, remove } = useResource<ProjectRow>("projects", {
    orderBy: "display_order",
    ascending: true,
    labelKey: "title",
  });
  const [editing, setEditing] = useState<(typeof blank & { id?: string }) | null>(null);

  return (
    <AdminPage
      title="Projects"
      description="Work shown on the homepage and the Work page."
      actions={<Button onClick={() => setEditing({ ...blank })}>New project</Button>}
    >
      {list.isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}

      {!list.isLoading && (list.data?.length ?? 0) === 0 && (
        <EmptyState>
          No projects yet. Until you add published projects, the website keeps showing its built-in
          examples.
        </EmptyState>
      )}

      <div className="divide-y divide-border rounded-md border border-border">
        {list.data?.map((project) => (
          <div key={project.id} className="flex items-center gap-4 px-4 py-3">
            <div className="h-12 w-16 shrink-0 overflow-hidden rounded bg-muted">
              {project.cover_image_url && (
                <img
                  src={project.cover_image_url}
                  alt=""
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{project.title}</p>
              <p className="truncate text-xs text-muted-foreground">
                {project.client_name || "—"} · {project.services.join(", ") || "No services"}
              </p>
            </div>
            <StatusPill status={project.status} />
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setEditing({
                  id: project.id,
                  title: project.title,
                  slug: project.slug,
                  client_name: project.client_name ?? "",
                  category: project.category,
                  short_description: project.short_description ?? "",
                  full_description: project.full_description ?? "",
                  services: project.services ?? [],
                  cover_image_url: project.cover_image_url ?? "",
                  cover_image_alt: project.cover_image_alt ?? "",
                  website_url: project.website_url ?? "",
                  featured: project.featured,
                  display_order: project.display_order,
                  status: project.status,
                  seo_title: project.seo_title ?? "",
                  seo_description: project.seo_description ?? "",
                })
              }
            >
              Edit
            </Button>
            <ConfirmDelete
              label={project.title}
              onConfirm={() => remove.mutate({ id: project.id, label: project.title })}
            />
          </div>
        ))}
      </div>

      <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Edit project" : "New project"}</DialogTitle>
          </DialogHeader>

          {editing && (
            <div className="space-y-5">
              <Field label="Title">
                <Input
                  value={editing.title}
                  maxLength={140}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      title: e.target.value,
                      slug: editing.id ? editing.slug : slugify(e.target.value),
                    })
                  }
                />
              </Field>
              <Field label="Web address name" hint="Used in the link, e.g. park-plaza-daycare">
                <Input
                  value={editing.slug}
                  maxLength={80}
                  onChange={(e) => setEditing({ ...editing, slug: slugify(e.target.value) })}
                />
              </Field>
              <Field label="Client name">
                <Input
                  value={editing.client_name}
                  maxLength={140}
                  onChange={(e) => setEditing({ ...editing, client_name: e.target.value })}
                />
              </Field>
              <Field label="What we did" hint="Separate with commas, e.g. Website, Social Media">
                <Input
                  value={editing.services.join(", ")}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      services: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
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
                label="Cover image"
                value={editing.cover_image_url}
                onChange={(url) => setEditing({ ...editing, cover_image_url: url })}
              />
              <Field label="Cover image description" hint="Describes the image for screen readers.">
                <Input
                  value={editing.cover_image_alt}
                  maxLength={200}
                  onChange={(e) => setEditing({ ...editing, cover_image_alt: e.target.value })}
                />
              </Field>
              <Field label="Website URL">
                <Input
                  value={editing.website_url}
                  maxLength={300}
                  placeholder="https://"
                  onChange={(e) => setEditing({ ...editing, website_url: e.target.value })}
                />
              </Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Order" hint="Lower numbers appear first.">
                  <Input
                    type="number"
                    value={editing.display_order}
                    onChange={(e) =>
                      setEditing({ ...editing, display_order: Number(e.target.value) || 0 })
                    }
                  />
                </Field>
                <div className="space-y-4 pt-7">
                  <div className="flex items-center gap-3">
                    <Switch
                      id="featured"
                      checked={editing.featured}
                      onCheckedChange={(v) => setEditing({ ...editing, featured: v })}
                    />
                    <Label htmlFor="featured">Feature on homepage</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch
                      id="status"
                      checked={editing.status === "published"}
                      onCheckedChange={(v) =>
                        setEditing({ ...editing, status: v ? "published" : "draft" })
                      }
                    />
                    <Label htmlFor="status">Published</Label>
                  </div>
                </div>
              </div>
              <Field label="Search title" hint="Shown in Google results. Under 60 characters.">
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
                if (!editing.title.trim()) return;
                save.mutate(
                  { ...editing, slug: editing.slug || slugify(editing.title) },
                  { onSuccess: () => setEditing(null) },
                );
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
