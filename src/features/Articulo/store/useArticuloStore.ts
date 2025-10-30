import { create } from "zustand";
import type { Articulo } from "../types";

interface ArticuloState {
  articulosRelevantes: Articulo[];
  setArticulosRelevantes: (articulos: Articulo[]) => void;
  clearArticulosRelevantes: () => void;
}

export const useArticuloStore = create<ArticuloState>((set) => ({
  articulosRelevantes: [],
  setArticulosRelevantes: (articulos) => set({ articulosRelevantes: articulos }),
  clearArticulosRelevantes: () => set({ articulosRelevantes: [] }),
}));