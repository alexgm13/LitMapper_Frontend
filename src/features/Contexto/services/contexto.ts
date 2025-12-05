import { ApiResponse } from "@/types/api";
import { api } from "../../../lib/api/config";
import { CreateContextRequest, ContextResponseData } from "../types";

export async function createContexto(data: CreateContextRequest): Promise<ApiResponse<ContextResponseData>> {
  try {
    const response = await api.post<ApiResponse<ContextResponseData>>("/api/v1/context/", data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const backendError = error.response.data as ApiResponse<null>;
      const mensaje = backendError?.message || "Error interno del servidor.";
      throw new Error(mensaje);
    }
    throw new Error(error.message || "Error de conexión con el servidor.");
  }
}