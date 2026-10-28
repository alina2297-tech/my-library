/**
 * Контракт согласован с Prisma-моделями StorageLocation и Book.
 * В JSON даты приходят строками ISO.
 * Поле photo — URL или путь к файлу. Сам файл отправляется отдельно через FormData.
 */

export interface StorageLocation {
  id: number
  title: string
  description: string | null
  address: string | null
  photo: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateStorageLocationDto {
  title: string
  description?: string
  address?: string
  photo?: string
}

export interface UpdateStorageLocationDto {
  title?: string
  description?: string | null
  address?: string | null
  photo?: string | null
}

export interface Book {
  id: number
  title: string
  author: string | null
  storageLocationId: number | null
  createdAt: string
  updatedAt: string
}

export function isDisplayablePhoto(photo: string | null): photo is string {
  if (photo === null || photo.trim() === '') return false

  const isRelative = photo.startsWith('/') && !photo.startsWith('//')
  const isAbsolute = photo.startsWith('http://') || photo.startsWith('https://')

  return isRelative || isAbsolute
}
