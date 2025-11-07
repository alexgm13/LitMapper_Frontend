export interface EntropiaSota {
  entropia_valor_sota: number;
  entropia_nivel_sota: string;
  total_palabras: number;
  palabras_unicas: number;
}

export interface SotaResponse {
  sota: string;
  entropia: EntropiaSota;
}

