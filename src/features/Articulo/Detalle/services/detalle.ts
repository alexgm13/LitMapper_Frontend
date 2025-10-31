// src/features/Analisis/services/analisisService.ts
import { api } from "@/lib/api/config";
import { Articulo } from "../../types";
import { Contexto } from "@/features/Contexto/types";


export async function procesarPDF(file: File, contexto: Contexto): Promise<Articulo> {
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
    throw new Error(data.message || "Error al procesar el PDF");
  }

  return data.data;
} 