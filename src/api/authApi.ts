import { instancia } from "@/api/client"
import { AuthResponse, LoginRequest, RegisterRequest } from "@/lib/models/auth"



export async function loginUser(payload: LoginRequest): Promise<AuthResponse> {
  
  const { data } = await instancia.post<AuthResponse>("/users/login", payload)
  console.log(data)
  return data
}

export async function registerUser(payload: RegisterRequest): Promise<AuthResponse> {
  const { data } = await instancia.post<AuthResponse>("/users/registrar", payload)
  return data
}