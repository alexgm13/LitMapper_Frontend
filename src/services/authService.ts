import { loginUser, registerUser } from "@/api/authApi"
import { LoginRequest, RegisterRequest, AuthResponse } from "@/lib/models/auth"

export const authService = {
  async login(payload: LoginRequest): Promise<AuthResponse> {
    
    const response = await loginUser(payload)
    console.log(response)
    return response
  
  },

  async register(payload: RegisterRequest): Promise<AuthResponse> {
    const response = await registerUser(payload)
    return response
  },
}
