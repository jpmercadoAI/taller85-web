import { createClient } from "@/lib/supabase/server";

export type GalleryImage = {
  id: string;
  image_url: string;
  alt_text: string | null;
  area: string | null;
};

export async function getProjectImagesByArea(area: string): Promise<GalleryImage[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("project_images")
    .select("id, image_url, alt_text, area")
    .eq("area", area)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(`Error cargando imágenes del área ${area}:`, error.message);
    return [];
  }

  return data ?? [];
}