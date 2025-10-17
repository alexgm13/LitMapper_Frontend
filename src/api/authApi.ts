import { instancia } from "@/api/client"
import { AuthResponse, LoginRequest, RegisterRequest } from "@/lib/models/auth"



export async function loginUser(payload: LoginRequest): Promise<AuthResponse> {
  
  const { data } = await instancia.post<AuthResponse>("api/users/login", payload)
  console.log(data)
  return data
}

export async function registerUser(payload: RegisterRequest): Promise<AuthResponse> {
  const { data } = await instancia.post<AuthResponse>("api/users/registrar", payload)
  return data
}