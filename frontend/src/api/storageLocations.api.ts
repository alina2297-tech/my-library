import { ApiError, http } from '@/api/http'
import type {
  Book,
  CreateStorageLocationDto,
  StorageLocation,
  UpdateStorageLocationDto,
} from '@/types/storageLocation'

/**
 * Пути заданы контрактом frontend. Сейчас backend монтирует те же операции на
 * `/api/storage` и не публикует `GET /:id/books`.
 * Метод с FormData подготовлен отдельно: в маршрутах Multer ещё не подключён,
 * а поле photo в базе — строка, а не файл.
 */
const STORAGE_LOCATIONS_PATH = '/api/storage'

export async function getStorageLocations(): Promise<StorageLocation[]> {
  const { data } = await http.get<unknown>(STORAGE_LOCATIONS_PATH)
  return parseStorageLocationList(data)
}

export async function getStorageLocationById(id: number): Promise<StorageLocation> {
  const { data } = await http.get<unknown>(`${STORAGE_LOCATIONS_PATH}/${id}`)

  if (data === null) {
    throw new ApiError('Место хранения не найдено', 404)
  }

  return parseStorageLocation(data)
}

export async function createStorageLocation(
  payload: CreateStorageLocationDto,
): Promise<StorageLocation> {
  const { data } = await http.post<unknown>(STORAGE_LOCATIONS_PATH, payload)
  return parseStorageLocation(data)
}

export async function updateStorageLocation(
  id: number,
  payload: UpdateStorageLocationDto,
): Promise<StorageLocation> {
  const { data } = await http.put<unknown>(`${STORAGE_LOCATIONS_PATH}/${id}`, payload)
  return parseStorageLocation(data)
}

export async function deleteStorageLocation(id: number): Promise<StorageLocation> {
  const { data } = await http.delete<unknown>(`${STORAGE_LOCATIONS_PATH}/${id}`)
  return parseStorageLocation(data)
}

export async function getBooksByStorageLocationId(id: number): Promise<Book[]> {
  const { data } = await http.get<unknown>(`${STORAGE_LOCATIONS_PATH}/${id}/books`)
  return parseBookList(data)
}

export async function createStorageLocationWithPhoto(
  payload: Omit<CreateStorageLocationDto, 'photo'>,
  photo: File,
): Promise<StorageLocation> {
  const formData = new FormData()
  formData.append('title', payload.title)
  appendField(formData, 'description', payload.description)
  appendField(formData, 'address', payload.address)
  formData.append('photo', photo)

  const { data } = await http.post<unknown>(STORAGE_LOCATIONS_PATH, formData)
  return parseStorageLocation(data)
}

function appendField(formData: FormData, key: string, value: string | undefined): void {
  if (value !== undefined) {
    formData.append(key, value)
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isNullableString(value: unknown): value is string | null | undefined {
  return value === undefined || value === null || typeof value === 'string'
}

interface StorageLocationPayload {
  id: number
  title: string
  description?: string | null
  address?: string | null
  photo?: string | null
  createdAt: string
  updatedAt: string
}

function isStorageLocationPayload(value: unknown): value is StorageLocationPayload {
  if (!isRecord(value)) return false

  return (
    typeof value.id === 'number' &&
    Number.isInteger(value.id) &&
    typeof value.title === 'string' &&
    isNullableString(value.description) &&
    isNullableString(value.address) &&
    isNullableString(value.photo) &&
    typeof value.createdAt === 'string' &&
    typeof value.updatedAt === 'string'
  )
}

function parseStorageLocation(value: unknown): StorageLocation {
  if (!isStorageLocationPayload(value)) {
    throw new ApiError('Сервер вернул неожиданный ответ')
  }

  return {
    id: value.id,
    title: value.title,
    description: value.description ?? null,
    address: value.address ?? null,
    photo: value.photo ?? null,
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
  }
}

function parseStorageLocationList(value: unknown): StorageLocation[] {
  if (!Array.isArray(value)) {
    throw new ApiError('Сервер вернул неожиданный ответ')
  }

  return value.map(parseStorageLocation)
}

interface BookPayload {
  id: number
  title: string
  author?: string | null
  storageLocationId?: number | null
  createdAt: string
  updatedAt: string
}

function isBookPayload(value: unknown): value is BookPayload {
  if (!isRecord(value)) return false

  const storageLocationId = value.storageLocationId
  const hasStorageLocationId =
    storageLocationId === undefined ||
    storageLocationId === null ||
    (typeof storageLocationId === 'number' && Number.isInteger(storageLocationId))

  return (
    typeof value.id === 'number' &&
    Number.isInteger(value.id) &&
    typeof value.title === 'string' &&
    isNullableString(value.author) &&
    hasStorageLocationId &&
    typeof value.createdAt === 'string' &&
    typeof value.updatedAt === 'string'
  )
}

function parseBook(value: unknown): Book {
  if (!isBookPayload(value)) {
    throw new ApiError('Сервер вернул неожиданный ответ')
  }

  return {
    id: value.id,
    title: value.title,
    author: value.author ?? null,
    storageLocationId: value.storageLocationId ?? null,
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
  }
}

function parseBookList(value: unknown): Book[] {
  if (!Array.isArray(value)) {
    throw new ApiError('Сервер вернул неожиданный ответ')
  }

  return value.map(parseBook)
}
