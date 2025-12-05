import { api } from "../../../lib/api/config";
import { ApiResponse } from "../../../types/api";
import { RegisterRequest, RegisterResponseData, LoginRequest, LoginResponseData } from "../types";

export const register = async (
  data: RegisterRequest
): Promise<ApiResponse<RegisterResponseData>> => {
  const response = await api.post<ApiResponse<RegisterResponseData>>(
    "/api/v1/auth/register",
    data
  );
  return response.data;
};

export const login = async (
  data: LoginRequest
): Promise<ApiResponse<LoginResponseData>> => {
  const response = await api.post<ApiResponse<LoginResponseData>>(
    "/api/v1/auth/login",
    data
  );
  return response.data;
};
