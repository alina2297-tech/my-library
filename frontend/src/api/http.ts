import axios, { type AxiosError } from 'axios'

const baseURL = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL)

export const http = axios.create({
  baseURL,
})

export class ApiError extends Error {
  readonly status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

http.interceptors.request.use((config) => {
  if (!config.baseURL) {
    throw new ApiError('Не задана переменная окружения VITE_API_BASE_URL')
  }

  const headers = axios.AxiosHeaders.from(config.headers)

  if (isFormData(config.data)) {
    headers.delete('Content-Type')
  } else if (config.data !== undefined) {
    headers.set('Content-Type', 'application/json')
  }

  config.headers = headers
  return config
})

http.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(toApiError(error)),
)

export function getErrorMessage(error: unknown): string {
  return toApiError(error).message
}

function normalizeBaseUrl(value: string | undefined): string | undefined {
  if (!value) return undefined

  const trimmed = value.trim()
  if (!trimmed) return undefined

  return trimmed.replace(/\/+$/, '')
}

function isFormData(value: unknown): value is FormData {
  return typeof FormData !== 'undefined' && value instanceof FormData
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error

  if (axios.isAxiosError(error)) {
    return new ApiError(resolveAxiosMessage(error), error.response?.status)
  }

  if (error instanceof Error && error.message.trim() !== '') {
    return new ApiError(error.message)
  }

  return new ApiError('Не удалось выполнить запрос')
}

function resolveAxiosMessage(error: AxiosError<unknown>): string {
  const data = error.response?.data

  if (isRecord(data) && typeof data.message === 'string' && data.message.trim() !== '') {
    return data.message
  }

  if (!error.response) {
    return 'Не удалось связаться с сервером'
  }

  if (error.response.status === 404) {
    return 'Ресурс не найден'
  }

  if (error.response.status >= 500) {
    return 'Сервер не смог обработать запрос'
  }

  return 'Не удалось выполнить запрос'
}
