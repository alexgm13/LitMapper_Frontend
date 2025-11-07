import { ApiResponse } from "@/types/api";
import { api } from "../../../lib/api/config";
import { Proyecto } from "../types";



export async function crearProyecto(data: Proyecto): Promise<Proyecto> {
  try {
    const response = await api.post<ApiResponse<Proyecto>>("/api/proyecto", data);

    const body = response.data;

    if (!body) {
      throw new Error("No se recibió respuesta del servidor.");
    }

    if (!body.success) {
      const errorMsg = body.message || "Error desconocido al crear el proyecto.";
      console.error("❌ Error API:", body.errors || errorMsg);
      throw new Error(errorMsg);
    }

    return body.data!;
  } catch (error: any) {
    if (error.response) {
      const backendError = error.response.data as ApiResponse<null>;
      const mensaje = backendError?.message || "Error interno del servidor.";
      throw new Error(mensaje);
    }

    throw new Error(error.message || "Error de conexión con el servidor.");
  }
}