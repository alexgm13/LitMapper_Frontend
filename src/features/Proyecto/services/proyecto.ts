import { ApiResponse } from "@/types/api";
import { api } from "../../../lib/api/config";
import { CreateProjectRequest, ProjectResponseData } from "../types";

export async function createProject(data: CreateProjectRequest): Promise<ApiResponse<ProjectResponseData>> {
  try {
    const response = await api.post<ApiResponse<ProjectResponseData>>("/api/v1/project/", data);
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

export async function getProjectsByUser(userId: number): Promise<ApiResponse<ProjectResponseData[]>> {
  try {
    const response = await api.get<ApiResponse<ProjectResponseData[]>>(`/api/v1/project/${userId}`);
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