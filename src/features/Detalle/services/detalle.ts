// src/features/Analisis/services/analisisService.ts
import { api } from "@/lib/api/config";
import { Articulo } from "@/features/Articulo/types";
import { Contexto } from "@/features/Contexto/types";
import { ArticuloDetalleListado } from "../types";
import { ApiResponse } from "@/types/api";


export async function procesarPDF(file: File, contexto: Contexto): Promise<ArticuloDetalleListado> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("area_general", contexto.area_general);
  formData.append("tema_especifico", contexto.tema_especifico);
  formData.append("problema_investigacion", contexto.problema_investigacion);
  formData.append("metodologia_enfoque", contexto.metodologia);

  const { data } = await api.post("/api/articulo/brecha", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  if (!data.success || !data.data) {
    throw new Error(data.errors || "Error al procesar el PDF");
  }

  return data.data;
}


export async function obtenerArticulosRelevantesDetallados(
  idProyecto: number
): Promise<ArticuloDetalleListado[]> {
  const { data } = await api.get<ApiResponse<ArticuloDetalleListado[]>>(
    `/api/articulo/detalle/${idProyecto}`
  );

  if (!data.success|| !data.data) throw new Error(data.message);
  return data.data;
}
