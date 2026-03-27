import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const bucket = "projects";
const folder = "proyecto-general";
const projectId = "f89e3aa5-03e6-48c8-9d02-707fa4616291";

async function main() {
  const { data, error } = await supabase.storage
    .from(bucket)
    .list(folder, { limit: 100 });

  if (error) {
    console.error("Error listando:", error);
    return;
  }

  console.log("Listado crudo:", data);

  const files = (data || []).filter((f) => f.name && !f.id?.includes?.("folder"));
  console.log("Cantidad de archivos:", files.length);

  const rows = files.map((file, index) => {
    const path = `${folder}/${file.name}`;
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);

    return {
      project_id: projectId,
      image_url: data.publicUrl,
      alt_text: file.name,
      sort_order: index,
    };
  });

  console.log("Rows a insertar:", rows.length);
  console.log("Primera row:", rows[0]);

  if (!rows.length) {
    console.log("No hay filas para insertar.");
    return;
  }

  const { data: inserted, error: insertError } = await supabase
    .from("project_images")
    .insert(rows)
    .select();

  if (insertError) {
    console.error("Error insertando:", insertError);
    return;
  }

  console.log("Insertadas realmente:", inserted?.length || 0);
}

main();