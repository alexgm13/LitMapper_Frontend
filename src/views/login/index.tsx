"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/hooks/useAuth" 

export default function LoginView() {
  const router = useRouter()
  const { login, register, loading, error } = useAuth() 
  const [showPassword, setShowPassword] = useState(false)
  const [currentView, setCurrentView] = useState<"login" | "register">("login")

  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [registerName, setRegisterName] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("")
  const [registerBirthDate, setRegisterBirthDate] = useState("")
  const [registerGender, setRegisterGender] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateLogin = () => {
    const newErrors: Record<string, string> = {}

    if (!loginEmail.trim()) {
      newErrors.loginEmail = "El correo es requerido"
    } else if (!validateEmail(loginEmail)) {
      newErrors.loginEmail = "Ingresa un correo válido"
    }

    if (!loginPassword.trim()) {
      newErrors.loginPassword = "La contraseña es requerida"
    } else if (loginPassword.length < 6) {
      newErrors.loginPassword = "La contraseña debe tener al menos 6 caracteres"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateRegister = () => {
    const newErrors: Record<string, string> = {}

    if (!registerName.trim()) {
      newErrors.registerName = "El nombre es requerido"
    }

    if (!registerEmail.trim()) {
      newErrors.registerEmail = "El correo es requerido"
    } else if (!validateEmail(registerEmail)) {
      newErrors.registerEmail = "Ingresa un correo válido"
    }

    if (!registerPassword.trim()) {
      newErrors.registerPassword = "La contraseña es requerida"
    } else if (registerPassword.length < 6) {
      newErrors.registerPassword = "La contraseña debe tener al menos 6 caracteres"
    }

    if (!registerConfirmPassword.trim()) {
      newErrors.registerConfirmPassword = "Confirma tu contraseña"
    } else if (registerPassword !== registerConfirmPassword) {
      newErrors.registerConfirmPassword = "Las contraseñas no coinciden"
    }

    if (!registerBirthDate) {
      newErrors.registerBirthDate = "La fecha de nacimiento es requerida"
    }

    if (!registerGender) {
      newErrors.registerGender = "Selecciona tu género"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 🔹 LOGIN — ahora llama al hook
  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      setErrors({ loginEmail: "Correo requerido", loginPassword: "Contraseña requerida" })
      return
    }
    await login({ email: loginEmail, contrasena: loginPassword })
  }

  // 🔹 REGISTRO — ahora llama al hook
  const handleRegister = async () => {

    if (registerPassword !== registerConfirmPassword) {
      setErrors({ registerConfirmPassword: "Las contraseñas no coinciden" })
      return
    }

    await register({
      nombre: registerName,
      email: registerEmail,
      id_rol: 1,
      contrasena: registerPassword,
      genero: registerGender,
      fecha_nacimiento: registerBirthDate,
    })
  }

  const handleViewChange = (view: "login" | "register") => {
    setCurrentView(view)
    setErrors({})
    setLoginEmail("")
    setLoginPassword("")
    setRegisterName("")
    setRegisterEmail("")
    setRegisterPassword("")
    setRegisterConfirmPassword("")
    setRegisterBirthDate("")
    setRegisterGender("")
  }

  return (
    <div className="min-h-screen flex font-sans">
      <div
        className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12"
        style={{ backgroundColor: "#001F3F" }}
      >
        <div className="text-center space-y-8 max-w-md">
          <div className="flex justify-center">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gemini_Generated_Image_oehlkmoehlkmoehl-Photoroom-7zE6tofCYPF5AVSpnxiZDtY1JYP8qg.png"
              alt="LitMapper AI - Análisis Inteligente de Literatura"
              className="object-contain w-[423px] h-[423px]"
            />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-light text-white" style={{ letterSpacing: "-0.5px" }}>
              {""}
            </h1>
            <p className="text-lg text-cyan-200 font-light leading-relaxed">{""}</p>
            <p className="text-sm text-white/60 font-light">
              {""}
            </p>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white overflow-y-auto">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gemini_Generated_Image_6rwhor6rwhor6rwh-1eiFSBiHZEwpyk7PKyYYlOPfGqAoHL.png"
              alt="LitMapper AI"
              className="w-32 h-32 object-contain mx-auto mb-4"
            />
            <h1 className="text-2xl font-light text-gray-900">LitMapper AI</h1>
          </div>

          {/* Form header */}
          <div className="space-y-3 text-center">
            <h2 className="text-3xl font-light text-gray-900">
              {currentView === "login" ? "Bienvenido" : "Crear Cuenta"}
            </h2>
            <p className="text-gray-500 font-light">
              {currentView === "login"
                ? "Inicia sesión para acceder a tu cuenta"
                : "Crea una nueva cuenta para comenzar"}
            </p>
          </div>

          {/* Form fields */}
          <div className="space-y-5">
            {currentView === "register" && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-light text-gray-700">
                  Nombre Completo
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Juan Pérez"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  className="h-11 border-gray-200 focus:ring-0 shadow-none rounded-lg bg-gray-50 focus:border-cyan-400 font-light"
                />
                {errors.registerName && <p className="text-red-500 text-xs font-light">{errors.registerName}</p>}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-light text-gray-700">
                Correo Electrónico
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="usuario@empresa.com"
                value={currentView === "login" ? loginEmail : registerEmail}
                onChange={(e) =>
                  currentView === "login" ? setLoginEmail(e.target.value) : setRegisterEmail(e.target.value)
                }
                className="h-11 border-gray-200 focus:ring-0 shadow-none rounded-lg bg-gray-50 focus:border-cyan-400 font-light"
              />
              {errors[currentView === "login" ? "loginEmail" : "registerEmail"] && (
                <p className="text-red-500 text-xs font-light">
                  {errors[currentView === "login" ? "loginEmail" : "registerEmail"]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-light text-gray-700">
                Contraseña
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingresa tu contraseña"
                  value={currentView === "login" ? loginPassword : registerPassword}
                  onChange={(e) =>
                    currentView === "login" ? setLoginPassword(e.target.value) : setRegisterPassword(e.target.value)
                  }
                  className="h-11 pr-10 border-gray-200 focus:ring-0 shadow-none rounded-lg bg-gray-50 focus:border-cyan-400 font-light"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
              {errors[currentView === "login" ? "loginPassword" : "registerPassword"] && (
                <p className="text-red-500 text-xs font-light">
                  {errors[currentView === "login" ? "loginPassword" : "registerPassword"]}
                </p>
              )}
            </div>

            {currentView === "register" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-light text-gray-700">
                    Confirmar Contraseña
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirma tu contraseña"
                      value={registerConfirmPassword}
                      onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                      className="h-11 pr-10 border-gray-200 focus:ring-0 shadow-none rounded-lg bg-gray-50 focus:border-cyan-400 font-light"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                  {errors.registerConfirmPassword && (
                    <p className="text-red-500 text-xs font-light">{errors.registerConfirmPassword}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthDate" className="text-sm font-light text-gray-700">
                    Fecha de Nacimiento
                  </Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={registerBirthDate}
                    onChange={(e) => setRegisterBirthDate(e.target.value)}
                    className="h-11 border-gray-200 focus:ring-0 shadow-none rounded-lg bg-gray-50 focus:border-cyan-400 font-light"
                  />
                  {errors.registerBirthDate && (
                    <p className="text-red-500 text-xs font-light">{errors.registerBirthDate}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-sm font-light text-gray-700">
                    Género
                  </Label>
                  <select
                    id="gender"
                    value={registerGender}
                    onChange={(e) => setRegisterGender(e.target.value)}
                    className="h-11 w-full border border-gray-200 rounded-lg bg-gray-50 focus:border-cyan-400 focus:ring-0 font-light px-3 text-gray-700"
                  >
                    <option value="">Selecciona tu género</option>
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                    <option value="otro">Otro</option>
                    <option value="prefiero-no-decir">Prefiero no decir</option>
                  </select>
                  {errors.registerGender && <p className="text-red-500 text-xs font-light">{errors.registerGender}</p>}
                </div>
              </>
            )}

            {currentView === "login" && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="remember" className="rounded border-gray-300 cursor-pointer" />
                  <Label htmlFor="remember" className="text-sm text-gray-600 font-light cursor-pointer">
                    Recuérdame
                  </Label>
                </div>
                <Button
                  variant="link"
                  className="p-0 h-auto text-sm font-light hover:text-opacity-80"
                  style={{ color: "#00D9FF" }}
                >
                  ¿Olvidaste tu contraseña?
                </Button>
              </div>
            )}
          </div>

          {/* Submit button */}
          <Button
            className="w-full h-11 text-sm font-light text-white hover:opacity-90 rounded-lg shadow-none"
            style={{ backgroundColor: "#00D9FF", color: "#001F3F" }}
            onClick={currentView === "login" ? handleLogin : handleRegister}
          >
            {currentView === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
          </Button>

          {/* Toggle between login and register */}
          <div className="text-center text-sm text-gray-600 font-light">
            {currentView === "login" ? (
              <>
                ¿No tienes cuenta?{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto text-sm font-light hover:text-opacity-80"
                  style={{ color: "#00D9FF" }}
                  onClick={() => handleViewChange("register")}
                >
                  Regístrate aquí
                </Button>
              </>
            ) : (
              <>
                ¿Ya tienes cuenta?{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto text-sm font-light hover:text-opacity-80"
                  style={{ color: "#00D9FF" }}
                  onClick={() => handleViewChange("login")}
                >
                  Inicia sesión
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
