import { create } from "zustand";
import type { ArticuloDetalleListado } from "../types";

interface ArticuloDetalleState {
  articulosDetalle: ArticuloDetalleListado[];
  setArticulosDetalle: (articulos: ArticuloDetalleListado[]) => void;
  limpiarArticulosDetalle: () => void;
}

export const useArticuloDetalleStore = create<ArticuloDetalleState>((set) => ({
  articulosDetalle: [],
  setArticulosDetalle: (articulos) => set({ articulosDetalle: articulos }),
  limpiarArticulosDetalle: () => set({ articulosDetalle: [] }),
}));
