"use client"
import { useState } from 'react';
import { User, Mail, Lock, Calendar, User as UserIcon, Eye, EyeOff, UserCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { register } from '../services/auth';
import { RegisterRequest } from '../types';
import { useAuthStore } from '../../../store/authStore';

export default function RegisterView() {
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    email: '',
    password: '',
    fechaNacimiento: '',
    genero: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const payload: RegisterRequest = {
        email: formData.email,
        password: formData.password,
        id_rol: 1, // Default role
        nombre: formData.nombreCompleto,
        fecha_nacimiento: formData.fechaNacimiento,
        genero: formData.genero
      };

      const response = await register(payload);
      
      if (response.success && response.data) {
        setUser(response.data);
        console.log('Registration successful:', response);
        alert('Usuario registrado exitosamente');
        router.push('/dashboard');
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Error al registrar usuario');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-center">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <UserCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Crear Cuenta
            </h1>
            <p className="text-blue-100">
              Únete a nuestra plataforma de investigación asistida por IA
            </p>
          </div>

          {/* Registration Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nombre Completo */}
              <div>
                <label htmlFor="nombreCompleto" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="nombreCompleto"
                    name="nombreCompleto"
                    value={formData.nombreCompleto}
                    onChange={handleChange}
                    placeholder="Juan Pérez García"
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-gray-50 hover:bg-white"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="tu@ejemplo.com"
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-gray-50 hover:bg-white"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-gray-50 hover:bg-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Fecha de Nacimiento */}
              <div>
                <label htmlFor="fechaNacimiento" className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Nacimiento
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="fechaNacimiento"
                    name="fechaNacimiento"
                    value={formData.fechaNacimiento}
                    onChange={handleChange}
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-gray-50 hover:bg-white"
                    required
                  />
                </div>
              </div>

              {/* Género */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Género
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <label className={`flex flex-col items-center justify-center px-4 py-3 border rounded-xl cursor-pointer transition-colors ${
                    formData.genero === 'masculino' 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}>
                    <UserIcon className="h-5 w-5 mb-1" />
                    <span className="text-sm font-medium">Masculino</span>
                    <input
                      type="radio"
                      name="genero"
                      value="masculino"
                      checked={formData.genero === 'masculino'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                  </label>
                  
                  <label className={`flex flex-col items-center justify-center px-4 py-3 border rounded-xl cursor-pointer transition-colors ${
                    formData.genero === 'femenino' 
                      ? 'border-pink-500 bg-pink-50 text-pink-700' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}>
                    <UserIcon className="h-5 w-5 mb-1" />
                    <span className="text-sm font-medium">Femenino</span>
                    <input
                      type="radio"
                      name="genero"
                      value="femenino"
                      checked={formData.genero === 'femenino'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                  </label>
                  
                  <label className={`flex flex-col items-center justify-center px-4 py-3 border rounded-xl cursor-pointer transition-colors ${
                    formData.genero === 'otro' 
                      ? 'border-purple-500 bg-purple-50 text-purple-700' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}>
                    <UserIcon className="h-5 w-5 mb-1" />
                    <span className="text-sm font-medium">Otro</span>
                    <input
                      type="radio"
                      name="genero"
                      value="otro"
                      checked={formData.genero === 'otro'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creando cuenta...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <UserCheck className="w-5 h-5" />
                    <span>Crear Cuenta</span>
                  </div>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    ¿Ya tienes una cuenta?
                  </span>
                </div>
              </div>
            </div>

            {/* Login Link */}
            <div className="mt-6">
              <button
                type="button"
                onClick={() => router.push('/auth/login')}
                className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Iniciar Sesión
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-gray-500 text-sm">
          <p>© 2025 LitMapper AI • Plataforma de investigación asistida por IA</p>
        </div>
      </div>
    </div>
  );
}
