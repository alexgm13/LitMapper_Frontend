export interface Articulo {
  id_articulo?: number;
  id_proyecto?:number;
  doi?: string;
  titulo?: string;
  resumen?: string;
  anio?: number;
  autor_palabras_clave?: string;
  index_palabras_clave?: string;
  detalle?: Detalle
  brecha?: Brecha
  link_publicacion?: string;
  pdf_procesado?: boolean;
}

export interface Detalle{
  id_articulo_detalle?: number;
  aportaciones: string;
  brechas_identificadas: string;
  enfoque_metodologico: string;
  fundamento_teorico: string;
  instrumentos_tecnicas: string;
  muestra_poblacion: string;
  notas_relevancia_contexto: string;
  objetivo_estudio: string;
  principales_resultados: string;
  problema_investigacion: string | null;
  es_relevante?: boolean;
  
}

export interface Brecha{
  tipo_brecha?: string;
  brecha_investigacion?: string;
}

export interface ArticuloListado {
  doi: string;
  titulo: string;
  id_articulo_detalle: number;
  es_relevante: boolean;
  explicacion: string;
}