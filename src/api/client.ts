import axios from "axios"
import { ENV } from "@/configs/env"

export const instancia = axios.create({
  baseURL: ENV.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})