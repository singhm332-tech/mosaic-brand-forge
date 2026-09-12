import { supabase } from "@/integrations/supabase/client";

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Records an audit entry. Never blocks the calling action. */
export async function logActivity(
  action: string,
  entityType: string,
  entityId?: string | null,
  entityLabel?: string | null,
) {
  try {
    const { data } = await supabase.auth.getUser();
    if (!data.user) return;
    await supabase.from("activity_log").insert({
      actor_id: data.user.id,
      actor_email: data.user.email ?? null,
      action,
      entity_type: entityType,
      entity_id: entityId ?? null,
      entity_label: entityLabel ?? null,
    });
  } catch {
    /* audit logging must never break an admin action */
  }
}

/** Uploads a file to the private media bucket and registers it in the media library. */
export async function uploadMedia(file: File, meta?: { title?: string; alt?: string }) {
  const { data: userData } = await supabase.auth.getUser();
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from("media")
    .upload(path, file, { cacheControl: "3600", contentType: file.type || undefined });
  if (uploadError) throw uploadError;

  const publicUrl = `/api/public/media/${path}`;

  const dimensions = await readImageSize(file);

  const { data, error } = await supabase
    .from("media_assets")
    .insert({
      storage_path: path,
      public_url: publicUrl,
      file_name: file.name,
      title: meta?.title ?? file.name,
      alt_text: meta?.alt ?? null,
      mime_type: file.type || null,
      file_size: file.size,
      width: dimensions?.width ?? null,
      height: dimensions?.height ?? null,
      uploaded_by: userData.user?.id ?? null,
    })
    .select()
    .single();
  if (error) throw error;

  await logActivity("uploaded", "media", data.id, file.name);
  return data;
}

function readImageSize(file: File): Promise<{ width: number; height: number } | null> {
  if (!file.type.startsWith("image/")) return Promise.resolve(null);
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      resolve(null);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}

export async function deleteMedia(id: string, storagePath: string, label: string) {
  await supabase.storage.from("media").remove([storagePath]);
  const { error } = await supabase.from("media_assets").delete().eq("id", id);
  if (error) throw error;
  await logActivity("deleted", "media", id, label);
}
