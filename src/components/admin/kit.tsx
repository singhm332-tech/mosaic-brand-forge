import {
  cloneElement,
  isValidElement,
  useId,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { uploadMedia } from "@/lib/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function AdminPage({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="flex gap-2">{actions}</div>}
      </header>
      <div className="mt-8">{children}</div>
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        status === "published"
          ? "bg-emerald-100 text-emerald-800"
          : "bg-muted text-muted-foreground",
      )}
    >
      {status.replace("_", " ")}
    </span>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-md border border-dashed border-border px-6 py-16 text-center text-sm text-muted-foreground">
      {children}
    </div>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  const generatedId = useId();
  // Associate the visible label with its control so the form is usable with
  // assistive technology and clicking the label focuses the input.
  const element = isValidElement(children)
    ? (children as ReactElement<{ id?: string }>)
    : undefined;
  const existingId = element?.props?.id;
  const htmlFor = existingId ?? generatedId;
  const control = element && !existingId ? cloneElement(element, { id: generatedId }) : children;

  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {control}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function ConfirmDelete({
  label,
  onConfirm,
  trigger,
}: {
  label: string;
  onConfirm: () => void | Promise<void>;
  trigger?: ReactNode;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger ?? (
          <Button variant="ghost" size="sm" className="text-destructive">
            Delete
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete “{label}”?</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently removes it from the website. This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => void onConfirm()}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/** Image field with a library picker and direct upload. */
export function ImageField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
}) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: assets = [] } = useQuery({
    queryKey: ["media-assets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("media_assets")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: open,
  });

  const upload = useMutation({
    mutationFn: (file: File) => uploadMedia(file),
    onSuccess: (asset) => {
      queryClient.invalidateQueries({ queryKey: ["media-assets"] });
      onChange(asset.public_url);
      setOpen(false);
      toast.success("Image uploaded.");
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Upload failed."),
  });

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-start gap-4">
        <label
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = Array.from(e.dataTransfer.files).find((f) => f.type.startsWith("image/"));
            if (file) upload.mutate(file);
          }}
          className="relative h-24 w-24 shrink-0 cursor-pointer overflow-hidden rounded border border-dashed border-border bg-muted hover:border-foreground"
        >
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            disabled={upload.isPending}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) upload.mutate(file);
              e.target.value = "";
            }}
          />
          {value ? (
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full place-items-center px-2 text-center text-[11px] leading-tight text-muted-foreground">
              {upload.isPending ? "Uploading…" : "Drop or click to add"}
            </div>
          )}
        </label>
        <div className="flex-1 space-y-2">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Image URL"
          />
          <div className="flex gap-2">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button type="button" variant="outline" size="sm">
                  Choose image
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Image library</DialogTitle>
                  <DialogDescription>Upload a new image or pick an existing one.</DialogDescription>
                </DialogHeader>
                <Input
                  type="file"
                  accept="image/*"
                  disabled={upload.isPending}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) upload.mutate(file);
                  }}
                />
                <div className="grid max-h-80 grid-cols-3 gap-3 overflow-y-auto sm:grid-cols-4">
                  {assets.map((asset) => (
                    <button
                      key={asset.id}
                      type="button"
                      onClick={() => {
                        onChange(asset.public_url);
                        setOpen(false);
                      }}
                      className="aspect-square overflow-hidden rounded border border-border hover:border-foreground"
                    >
                      <img
                        src={asset.public_url}
                        alt={asset.alt_text ?? ""}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
            {value && (
              <Button type="button" variant="ghost" size="sm" onClick={() => onChange("")}>
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

/**
 * Multiple-image field: drag files in, upload several at once, pick from the
 * library, reorder or remove. Used for project photo galleries.
 */
export function GalleryField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string[];
  onChange: (urls: string[]) => void;
  hint?: string;
}) {
  const [open, setOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const queryClient = useQueryClient();

  const { data: assets = [] } = useQuery({
    queryKey: ["media-assets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("media_assets")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: open,
  });

  const upload = useMutation({
    mutationFn: async (files: File[]) => {
      const urls: string[] = [];
      for (const file of files) {
        const asset = await uploadMedia(file);
        urls.push(asset.public_url);
      }
      return urls;
    },
    onSuccess: (urls) => {
      queryClient.invalidateQueries({ queryKey: ["media-assets"] });
      onChange([...value, ...urls]);
      toast.success(urls.length === 1 ? "Image added." : `${urls.length} images added.`);
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Upload failed."),
  });

  const addFiles = (files: FileList | null) => {
    const list = Array.from(files ?? []).filter((f) => f.type.startsWith("image/"));
    if (list.length) upload.mutate(list);
  };

  const move = (index: number, direction: -1 | 1) => {
    const next = [...value];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target]!, next[index]!];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <Label>{label}</Label>

      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {value.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="group relative aspect-square overflow-hidden rounded border border-border bg-muted"
            >
              <img src={url} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 flex justify-between bg-background/85 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  aria-label="Move earlier"
                  className="px-2 py-1 text-xs disabled:opacity-30"
                  disabled={index === 0}
                  onClick={() => move(index, -1)}
                >
                  ←
                </button>
                <button
                  type="button"
                  aria-label="Remove image"
                  className="px-2 py-1 text-xs text-destructive"
                  onClick={() => onChange(value.filter((_, i) => i !== index))}
                >
                  Remove
                </button>
                <button
                  type="button"
                  aria-label="Move later"
                  className="px-2 py-1 text-xs disabled:opacity-30"
                  disabled={index === value.length - 1}
                  onClick={() => move(index, 1)}
                >
                  →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed px-6 py-8 text-center text-sm text-muted-foreground transition-colors",
          dragging ? "border-foreground bg-muted" : "border-border hover:border-foreground",
        )}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          disabled={upload.isPending}
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
        {upload.isPending ? "Uploading…" : "Drag images here, or click to choose from your device"}
      </label>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button type="button" variant="outline" size="sm">
            Add from image library
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Image library</DialogTitle>
            <DialogDescription>Click an image to add it to this gallery.</DialogDescription>
          </DialogHeader>
          <div className="grid max-h-80 grid-cols-3 gap-3 overflow-y-auto sm:grid-cols-4">
            {assets.map((asset) => (
              <button
                key={asset.id}
                type="button"
                onClick={() => onChange([...value, asset.public_url])}
                className="aspect-square overflow-hidden rounded border border-border hover:border-foreground"
              >
                <img
                  src={asset.public_url}
                  alt={asset.alt_text ?? ""}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export { Button, Input, Textarea, Label };
