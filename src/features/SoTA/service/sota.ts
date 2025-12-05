import { api } from "@/lib/api/config";
import { ApiResponse } from "@/types/api";
import type { ArticuloDetalleListado } from "@/features/Detalle/types";
import type { Contexto } from "@/features/Contexto/types";
import { SotaResponse } from "../types";

export async function generarSota(
  contexto: Contexto,
  articulos: ArticuloDetalleListado[]
): Promise<SotaResponse> {
  try {
    const payload = {
      contexto: {
        area_general: contexto.area_general,
        tema_especifico: contexto.tema_especifico,
        problema_investigacion: contexto.problema_investigacion,
        metodologia_enfoque: contexto.metodologia,
      },
      articulos: articulos.map((a) => ({
        doi: a.doi || "",
        autores: a.autores || [],
        titulo: a.titulo,
        palabras_clave: a.palabras_clave || [],
        objetivo_estudio: a.objetivo_estudio,
        metodologia: a.enfoque_metodologico,
        hallazgos: a.principales_resultados ? a.principales_resultados.split("\n") : [],
        brecha: {
          categoria: a.brechas_identificada.tipo,
          descripcion: a.brechas_identificada.descripcion,
          cita_evidencia_original: a.brechas_identificada.sustento || ""
        }
      })),
    };

    const { data } = await api.post<ApiResponse<SotaResponse>>("/api/v1/sota/", payload);

    if (!data.success || !data.data) {
      console.error("❌ Error al generar SOTA:", data.errors || data.message);
      throw new Error(data.message || "Error al generar el Estado del Arte");
    }

    const response = data.data;

    return {
      sota: response.sota,
      entropia: response.entropia,
    };
  } catch (error) {
    console.error("Error en generarSota service:", error);
    throw error;
  }
}
