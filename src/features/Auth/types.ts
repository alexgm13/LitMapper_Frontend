export interface RegisterRequest {
  email: string;
  password: string;
  id_rol: number;
  nombre: string;
  fecha_nacimiento: string;
  genero: string;
}

export interface RegisterResponseData {
  id_usuario: number;
  email: string;
  nombre: string;
  estado: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponseData {
  id_usuario: number;
  email: string;
  nombre: string;
  estado: string;
}
