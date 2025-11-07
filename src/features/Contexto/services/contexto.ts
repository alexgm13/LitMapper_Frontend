import { ApiResponse } from "@/types/api";
import { api } from "../../../lib/api/config";
import { Contexto } from "../types";



export async function crearContexto(data: Contexto): Promise<Contexto> {
  try {
    const response = await api.post<ApiResponse<Contexto>>("/api/tema", data);

    const body = response.data;

    if (!body) {
      throw new Error("No se recibió respuesta del servidor.");
    }

    if (!body.success) {
      const errorMsg = body.message || "Error desconocido al crear el contexto.";
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