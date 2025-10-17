"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { authService } from "@/services/authService"
import { LoginRequest, RegisterRequest } from "@/lib/models/auth"

export function useAuth() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 🔹 LOGIN
  async function login(payload: LoginRequest) {
    setLoading(true)
    setError(null)
    try {
      const res = await authService.login(payload)
      if (res.success) {
        router.push("/home")
      } else {
        throw new Error(res.message)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // 🔹 REGISTRO
  async function register(payload: RegisterRequest) {
    setLoading(true)
    setError(null)
    try {
      const res = await authService.register(payload)
      if (res.success) {
        router.push("/")
      } else {
        throw new Error(res.message)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { login, register, loading, error }
}
