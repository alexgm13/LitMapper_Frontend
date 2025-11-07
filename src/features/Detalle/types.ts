export interface ArticuloDetalleListado {
  id_articulo_detalle?: number;
  titulo: string;
  problema_investigacion: string;
  objetivo_estudio: string;
  fundamento_teorico: string;
  enfoque_metodologico: string;
  muestra_poblacion: string;
  instrumentos_tecnicas: string;
  principales_resultados: string;
  tipo_brecha: string;
  brecha_identificada: string;
  aportaciones: string;
  notas_relevancia_contexto: string;
  pdf_procesado?: boolean
}
