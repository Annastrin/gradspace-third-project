import {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosError,
  AxiosResponse,
} from "axios"
import { BaseUrl } from "../environment"

export const setupInterceptorsTo = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.request.use(onRequest, onRequestError)
  axiosInstance.interceptors.response.use(onResponse, onResponseError)
  return axiosInstance
}

const onRequest = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  config = {
    ...config,
    baseURL: BaseUrl,
  }

  if (!config.url?.includes("login")) {
    const userData = localStorage.getItem("products-table-user")

    if (userData) {
      const parsedValue = JSON.parse(userData)
      const userToken = parsedValue.token

      config.headers.set("token", userToken)
    }
  }
  return config
}

const onRequestError = (error: AxiosError | Error) => {
  console.log(error)
  return Promise.reject(error)
}

const onResponse = (response: AxiosResponse) => {
  return response
}

const onResponseError = (error: AxiosError | Error) => {
  console.log(error)
  return Promise.reject(error)
}
