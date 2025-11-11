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
  brechas_identificada: Brecha;
  aportaciones: string;
  notas_relevancia_contexto: string;
  pdf_procesado?: boolean
}

export interface Brecha {
  tipo: 'Conceptual' | 'Metodológica' | 'De Datos' | 'De Comprensión' | 'De Intervención';
  descripcion: string;
  sustento?: string;
}