import axios from "axios"
import { setupInterceptorsTo } from "./interceptor"
import type { SendUserData } from "../types"

const axiosInstance = setupInterceptorsTo(axios.create())

export const apiLogin = async (path: string, data: SendUserData) =>
  axiosInstance.post(`${path}`, data)

export const apiGet = async (path: string) => axiosInstance.get(`${path}`)

export const apiPost = async (path: string, data: FormData) =>
  axiosInstance.post(`${path}`, data)

export const apiPut = async (path: string, data: FormData) =>
  axiosInstance.put(`${path}`, data)

export const apiDelete = async (path: string) => axiosInstance.delete(`${path}`)
