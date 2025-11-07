import { Contexto } from "@/features/Contexto/types";
import { api } from "@/lib/api/config"; 
import { ApiResponse } from "@/types/api";
import { ArticuloListado } from "../types";



export async function subirArchivoCSV(
  file: File,
  contexto: Contexto,
  idProyecto: number
): Promise<void> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("area_general", contexto.area_general);
  formData.append("tema_especifico", contexto.tema_especifico);
  formData.append("problema_investigacion", contexto.problema_investigacion);
  formData.append("metodologia_enfoque", contexto.metodologia);
  formData.append("id_proyecto", idProyecto.toString());

  const { data } = await api.post<ApiResponse<null>>("/api/articulo/CSV", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  // Validar respuesta
  if (!data.success) {
    console.error("❌ Error al procesar CSV:", data.errors || data.message);
    throw new Error(data.message || "Error al procesar el archivo CSV");
  }

  console.log("✅ CSV procesado correctamente:", data.message);
  // No se retorna nada, ya que el backend no envía artículos
}

export async function obtenerArticulos(id_proyecto: number) {
  const { data } = await api.get<ApiResponse<ArticuloListado[]>>(`/api/articulo/${id_proyecto}`);
  if (!data.success) throw new Error(data.message);
  return data.data;
}


export async function actualizarRelevancia(id_detalle: number, es_relevante: boolean) {
  const { data } = await api.put<ApiResponse>(
    `/api/articulo/detalle/${id_detalle}`,
    { es_relevante }
  );
  if (!data.success) throw new Error(data.message);
  return data.data;
}
