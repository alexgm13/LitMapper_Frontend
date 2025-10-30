// src/features/Analisis/services/analisisService.ts
import { api } from "@/lib/api/config";

export interface AnalisisArticulo {
  id_articulo: number;
  doi?: string;
  titulo?: string;
  resumen?: string;
  anio?: number;
  autor_palabras_clave?: string;
  index_palabras_clave?: string;
  es_relevante?: boolean;
  objetivo_estudio?: string;
  metodologia?: string;
  hallazgos?: string;
  tipo_brecha?: string;
  brecha_investigacion?: string;
  link_publicacion?: string;
  pdf_procesado?: boolean;
}

export async function procesarPDF(id_articulo: number, file: File): Promise<AnalisisArticulo> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("id_articulo", id_articulo.toString());

  const { data } = await api.post("/api/analisis/pdf", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  if (!data.success || !data.data) {
    throw new Error(data.message || "Error al procesar el PDF");
  }

  return data.data;
}
