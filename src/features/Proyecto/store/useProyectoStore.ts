import { create } from "zustand";
import { Proyecto } from "../types";

interface ProyectoState {
  proyectoActivo: Proyecto | null;
  setProyectoActivo: (proyecto: Proyecto) => void;
  limpiarProyecto: () => void;
}

export const useProyectoStore = create<ProyectoState>((set) => ({
      proyectoActivo: null,
      setProyectoActivo: (proyecto) => set({ proyectoActivo: proyecto }),
      limpiarProyecto: () => set({ proyectoActivo: null }),
    })
  );
