export interface Articulo {
  id_articulo?: number;
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
  id_articulo_detall?: number;
  es_relevante?: boolean;
  explicacion?:string;
  objetivo_estudio?: string;
  metodologia?: string;
  hallazgos?: string;
}

export interface Brecha{
  tipo_brecha?: string;
  brecha_investigacion?: string;
}