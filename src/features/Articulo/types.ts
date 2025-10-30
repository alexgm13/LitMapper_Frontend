export interface Articulo {
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