import { Contexto } from "@/features/Contexto/types";
import { api } from "@/lib/api/config"; 
import { ApiResponse } from "@/types/api";
import { Articulo } from "../types";



export async function subirArchivoCSV(file: File, contexto: Contexto): Promise<Articulo[]> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("area_general", contexto.area_general);
  formData.append("tema_especifico", contexto.tema_especifico);
  formData.append("problema_investigacion", contexto.problema_investigacion);
  formData.append("metodologia_enfoque", contexto.metodologia);

  const { data } = await api.post<ApiResponse<Articulo[]>>("/api/articulo/CSV", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  if (!data.success) {
    console.error("❌ Error al procesar CSV:", data.errors || data.message);
    throw new Error(data.message || "Error al procesar el archivo CSV");
  }

  if (!Array.isArray(data.data)) {
    throw new Error("La respuesta del servidor no contiene una lista de artículos válida.");
  }

  console.log("✅ Artículos procesados:", data.data);
  return data.data;
}