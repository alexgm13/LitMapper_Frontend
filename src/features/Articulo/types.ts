export interface Articulo {
  id_articulo: number;
  doi: string;
  titulo: string;
  resumen: string;
  detalle: Detalle;
}

export interface Detalle {
  es_relevante: boolean;
  justificacion: string;
}

export interface ArticuloListado extends Articulo {}