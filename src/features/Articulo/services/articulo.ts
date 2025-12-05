import { Contexto } from "@/features/Contexto/types";
import { api } from "@/lib/api/config"; 
import { ApiResponse } from "@/types/api";
import { Articulo } from "../types";

export async function subirArchivoCSV(
  file: File,
  contexto: Contexto,
  idProyecto: number
): Promise<Articulo[]> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("area_general", contexto.area_general);
  formData.append("tema_especifico", contexto.tema_especifico);
  formData.append("problema_investigacion", contexto.problema_investigacion);
  formData.append("metodologia", contexto.metodologia); // Changed from metodologia_enfoque to metodologia based on user request
  formData.append("id_proyecto", idProyecto.toString());

  const { data } = await api.post<ApiResponse<Articulo[]>>("/api/v1/articule/detalle", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  console.log("✅ CSV procesado correctamente:", data.data);
  if (!data.success) {
    console.error("❌ Error al procesar CSV:", data.errors || data.message);
    throw new Error(data.message || "Error al procesar el archivo CSV");
  }

  console.log("✅ CSV procesado correctamente:", data.message);
  return data.data || [];
}

export async function obtenerArticulos(id_proyecto: number): Promise<Articulo[]> {
  const { data } = await api.get<ApiResponse<Articulo[]>>(`/api/articulo/${id_proyecto}`);
  if (!data.success) throw new Error(data.message);
  return data.data || [];
}


