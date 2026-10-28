import {
  createStorageLocation,
  deleteStorageLocation,
  getBooksByStorageLocationId,
  getStorageLocationById,
  getStorageLocations,
  updateStorageLocation,
} from '@/api/storageLocations.api'
import { getErrorMessage } from '@/api/http'
import type {
  Book,
  CreateStorageLocationDto,
  StorageLocation,
  UpdateStorageLocationDto,
} from '@/types/storageLocation'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useStorageLocationsStore = defineStore('storageLocations', () => {
  const locations = ref<StorageLocation[]>([])
  const selectedLocation = ref<StorageLocation | null>(null)
  const books = ref<Book[]>([])
  const isLoading = ref(false)
  const isLocationLoading = ref(false)
  const isBooksLoading = ref(false)
  const error = ref<string | null>(null)
  const locationError = ref<string | null>(null)
  const booksError = ref<string | null>(null)

  let listRequestId = 0
  let locationRequestId = 0
  let booksRequestId = 0
  let booksLocationId: number | null = null

  async function fetchLocations(): Promise<void> {
    const requestId = ++listRequestId
    isLoading.value = true
    error.value = null

    try {
      const nextLocations = await getStorageLocations()
      if (requestId !== listRequestId) return
      locations.value = nextLocations
    } catch (err) {
      if (requestId !== listRequestId) return
      error.value = getErrorMessage(err)
    } finally {
      if (requestId === listRequestId) {
        isLoading.value = false
      }
    }
  }

  async function fetchLocationById(id: number): Promise<void> {
    const requestId = ++locationRequestId

    if (selectedLocation.value?.id !== id) {
      selectedLocation.value = null
    }

    isLocationLoading.value = true
    locationError.value = null

    try {
      const location = await getStorageLocationById(id)
      if (requestId !== locationRequestId) return
      selectedLocation.value = location
    } catch (err) {
      if (requestId !== locationRequestId) return
      locationError.value = getErrorMessage(err)
    } finally {
      if (requestId === locationRequestId) {
        isLocationLoading.value = false
      }
    }
  }

  async function fetchBooks(locationId: number): Promise<void> {
    const requestId = ++booksRequestId

    if (booksLocationId !== locationId) {
      books.value = []
      booksLocationId = locationId
    }

    isBooksLoading.value = true
    booksError.value = null

    try {
      const nextBooks = await getBooksByStorageLocationId(locationId)
      if (requestId !== booksRequestId) return
      books.value = nextBooks
    } catch (err) {
      if (requestId !== booksRequestId) return
      booksError.value = getErrorMessage(err)
    } finally {
      if (requestId === booksRequestId) {
        isBooksLoading.value = false
      }
    }
  }

  async function createLocation(payload: CreateStorageLocationDto): Promise<StorageLocation> {
    error.value = null

    try {
      const created = await createStorageLocation(payload)
      locations.value = [created, ...locations.value.filter((item) => item.id !== created.id)]
      return created
    } catch (err) {
      error.value = getErrorMessage(err)
      throw err
    }
  }

  async function updateLocation(
    id: number,
    payload: UpdateStorageLocationDto,
  ): Promise<StorageLocation> {
    error.value = null

    try {
      const updated = await updateStorageLocation(id, payload)
      locations.value = locations.value.map((item) => (item.id === id ? updated : item))

      if (selectedLocation.value?.id === id) {
        selectedLocation.value = updated
      }

      return updated
    } catch (err) {
      error.value = getErrorMessage(err)
      throw err
    }
  }

  async function deleteLocation(id: number): Promise<void> {
    error.value = null

    try {
      await deleteStorageLocation(id)
      locations.value = locations.value.filter((item) => item.id !== id)

      if (selectedLocation.value?.id === id) {
        selectedLocation.value = null
        books.value = []
        booksLocationId = null
      }
    } catch (err) {
      error.value = getErrorMessage(err)
      throw err
    }
  }

  return {
    locations,
    selectedLocation,
    books,
    isLoading,
    isLocationLoading,
    isBooksLoading,
    error,
    locationError,
    booksError,
    fetchLocations,
    fetchLocationById,
    fetchBooks,
    createLocation,
    updateLocation,
    deleteLocation,
  }
})
