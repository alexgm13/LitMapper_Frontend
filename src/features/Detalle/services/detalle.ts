// src/features/Analisis/services/analisisService.ts
import { api } from "@/lib/api/config";

import { Contexto } from "@/features/Contexto/types";
import { ArticuloDetalleListado } from "../types";
import { ApiResponse } from "@/types/api";


export async function procesarPDF(file: File): Promise<ArticuloDetalleListado> {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await api.post("/api/v1/articule/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  if (!data.success || !data.data) {
    throw new Error(data.message || "Error al procesar el PDF");
  }

  const articule = data.data.articule;
  const details = articule.details;
  console.log(articule);

  return {
    titulo: details.titulo,
    autores: details.autores,
    palabras_clave: details.palabras_clave,
    doi: details.doi,
    objetivo_estudio: details.objetivo_estudio,
    enfoque_metodologico: details.metodologia,
    principales_resultados: Array.isArray(details.hallazgos) ? details.hallazgos.join("\n") : details.hallazgos,
    brechas_identificada: {
      tipo: details.brecha.categoria,
      descripcion: details.brecha.descripcion,
      sustento: details.brecha.cita_evidencia_original
    },
    notas_relevancia_contexto: "",
    pdf_procesado: true,
    entropy: articule.entropy,
    score: articule.score
  };
}
