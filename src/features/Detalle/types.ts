export interface ArticuloDetalleListado {
  id_articulo_detalle?: number;
  titulo: string;
  autores?: string[];
  palabras_clave?: string[];
  doi?: string;
  objetivo_estudio: string;
  enfoque_metodologico: string;
  principales_resultados: string;
  brechas_identificada: Brecha;
  notas_relevancia_contexto: string;
  pdf_procesado?: boolean;
  entropy?: number;
  score?: {
    score_factualidad_cita: number;
    feedback_cita: string;
    score_factualidad_descripcion: number;
    feedback_descripcion: string;
    veredicto: string;
    puntaje_promedio: number;
  };
}

export interface Brecha {
  tipo: 'Conceptual' | 'Metodológica' | 'De Datos' | 'De Comprensión' | 'De Intervención' | '';
  descripcion: string;
  sustento?: string;
}