import { create } from "zustand";
import { Contexto } from "../types";

interface ContextoState {
  contextoActivo: Contexto | null;
  setContextoActivo: (contexto: Contexto) => void;
  limpiarContexto: () => void;
}

export const useContextoStore = create<ContextoState>((set) => ({
      contextoActivo: null,
      setContextoActivo: (contexto) => set({ contextoActivo: contexto }),
      limpiarContexto: () => set({ contextoActivo: null }),
    })
  );
