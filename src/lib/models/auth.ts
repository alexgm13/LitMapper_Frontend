export interface LoginRequest {
  email: string
  contrasena: string
}

export interface RegisterRequest {
  nombre: string
  email: string
  id_rol: number
  contrasena: string
  genero: string
  fecha_nacimiento: string
}

export interface AuthResponse {
  success: boolean
  message: string
  token?: string
  usuario?: {
    id_user: number
    nombre: string
    email: string
    id_rol?: number
  }
}