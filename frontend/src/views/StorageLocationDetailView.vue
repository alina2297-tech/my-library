<script setup lang="ts">
import { useStorageLocationsStore } from '@/stores/storageLocations.store'
import { isDisplayablePhoto } from '@/types/storageLocation'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const store = useStorageLocationsStore()
const { selectedLocation, books, isLocationLoading, isBooksLoading, locationError, booksError } =
  storeToRefs(store)

const photoFailed = ref(false)

const locationId = computed(() => parseLocationId(route.params.id))

watch(
  locationId,
  (id) => {
    photoFailed.value = false

    if (id === null) return

    void store.fetchLocationById(id)
    void store.fetchBooks(id)
  },
  { immediate: true },
)

function reloadLocation(): void {
  if (locationId.value === null) return
  void store.fetchLocationById(locationId.value)
}

function reloadBooks(): void {
  if (locationId.value === null) return
  void store.fetchBooks(locationId.value)
}

function parseLocationId(param: unknown): number | null {
  const raw = Array.isArray(param) ? param[0] : param

  if (typeof raw !== 'string' || !/^[1-9]\d*$/.test(raw)) {
    return null
  }

  return Number(raw)
}
</script>

<template>
  <section class="page">
    <RouterLink class="back" :to="{ name: 'storage-locations' }">К списку</RouterLink>

    <p v-if="locationId === null" class="error" role="alert">
      Некорректный идентификатор места хранения.
    </p>

    <template v-else>
      <p v-if="isLocationLoading" class="status" role="status">Загрузка места хранения…</p>

      <div v-if="locationError" class="error" role="alert">
        <p>{{ locationError }}</p>
        <button type="button" :disabled="isLocationLoading" @click="reloadLocation">
          Повторить
        </button>
      </div>

      <article v-if="selectedLocation" class="details">
        <img
          v-if="isDisplayablePhoto(selectedLocation.photo) && !photoFailed"
          :src="selectedLocation.photo"
          :alt="selectedLocation.title"
          @error="photoFailed = true"
        />
        <h1>{{ selectedLocation.title }}</h1>
        <p v-if="selectedLocation.description">{{ selectedLocation.description }}</p>
        <p v-if="selectedLocation.address" class="address">Адрес: {{ selectedLocation.address }}</p>

        <section class="books" aria-labelledby="books-heading">
          <h2 id="books-heading">Книги</h2>
          <p v-if="isBooksLoading" class="status" role="status">Загрузка книг…</p>

          <div v-if="booksError" class="error" role="alert">
            <p>{{ booksError }}</p>
            <button type="button" :disabled="isBooksLoading" @click="reloadBooks">Повторить</button>
          </div>

          <p v-else-if="!isBooksLoading && books.length === 0" class="status">
            В этом месте пока нет книг.
          </p>

          <ul v-if="books.length > 0">
            <li v-for="book in books" :key="book.id">
              <span>{{ book.title }}</span>
              <span v-if="book.author" class="author">{{ book.author }}</span>
            </li>
          </ul>
        </section>
      </article>
    </template>
  </section>
</template>

<style scoped>
.back {
  justify-self: start;
  color: var(--muted);
  text-decoration: none;
}

.back:hover {
  color: var(--text);
}

.details {
  display: grid;
  gap: 0.85rem;
  padding: 1rem;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: var(--surface);
  box-shadow: var(--shadow);
}

.details img {
  width: 100%;
  max-height: 22rem;
  object-fit: cover;
  border-radius: 12px;
}

.address {
  color: var(--muted);
}

.books {
  display: grid;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.books ul {
  display: grid;
  gap: 0.75rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.books li {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1rem;
  justify-content: space-between;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--line);
}

.author {
  color: var(--muted);
}
</style>
