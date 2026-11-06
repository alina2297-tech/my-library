<script setup lang="ts">
import arrowLeft from '@/assets/arrow-left.svg'
import MainHeader from '@/layouts/MainHeader.vue'
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
const photoUrl = computed(() => {
  const photo = selectedLocation.value?.photo ?? null
  if (!isDisplayablePhoto(photo) || photoFailed.value) return null
  return photo
})
const showBooks = computed(
  () => !isBooksLoading.value && booksError.value === null && books.value.length > 0,
)
const booksMissing = computed(
  () => !isBooksLoading.value && (booksError.value !== null || books.value.length === 0),
)
const booksCountLabel = computed(() => formatBooksCount(books.value.length))

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

watch(
  () => selectedLocation.value?.photo,
  () => {
    photoFailed.value = false
  },
)

function reloadLocation(): void {
  if (locationId.value === null) return
  void store.fetchLocationById(locationId.value)
}

function parseLocationId(param: unknown): number | null {
  const raw = Array.isArray(param) ? param[0] : param

  if (typeof raw !== 'string' || !/^[1-9]\d*$/.test(raw)) {
    return null
  }

  return Number(raw)
}

function formatBooksCount(count: number): string {
  const mod10 = count % 10
  const mod100 = count % 100

  if (mod10 === 1 && mod100 !== 11) return `${count} книга`
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${count} книги`

  return `${count} книг`
}
</script>

<template>
  <div class="screen">
    <MainHeader />

    <section class="content">
      <p v-if="locationId === null" class="notice" role="alert">
        Некорректный идентификатор места хранения.
      </p>

      <template v-else>
        <p v-if="isLocationLoading && !selectedLocation" class="notice" role="status">
          Загрузка места хранения…
        </p>

        <div v-if="locationError" class="notice notice--error" role="alert">
          <p>{{ locationError }}</p>
          <button type="button" class="retry" :disabled="isLocationLoading" @click="reloadLocation">
            Повторить
          </button>
        </div>

        <template v-if="selectedLocation">
          <div class="about">
            <RouterLink class="back" :to="{ name: 'storage-locations' }">
              <img class="back-icon" :src="arrowLeft" alt="" width="20" height="20" />
              к списку мест хранения
            </RouterLink>

            <div class="photo-frame">
              <img
                v-if="photoUrl"
                class="photo"
                :src="photoUrl"
                :alt="selectedLocation.title"
                @error="photoFailed = true"
              />
            </div>

            <div class="info">
              <h1 class="heading">{{ selectedLocation.title }}</h1>
              <p v-if="selectedLocation.description" class="description">
                {{ selectedLocation.description }}
              </p>
              <p v-if="selectedLocation.address" class="address">
                Расположение: {{ selectedLocation.address }}
              </p>
            </div>
          </div>

          <section class="books" aria-labelledby="books-heading">
            <div class="books-head">
              <h2 id="books-heading" class="books-title">книги</h2>
              <p v-if="showBooks" class="books-count">{{ booksCountLabel }}</p>
            </div>

            <p v-if="isBooksLoading" class="books-state" role="status">Загрузка книг…</p>
            <p v-else-if="booksMissing" class="books-state">Не обнаружены</p>

            <ul v-else class="grid">
              <li v-for="book in books" :key="book.id" class="card">
                <div class="cover-frame">
                  <div class="cover">
                    <p v-if="book.author" class="cover-author">{{ book.author }}</p>
                    <p class="cover-title">{{ book.title }}</p>
                  </div>
                </div>
                <div class="meta">
                  <h3 class="book-title">{{ book.title }}</h3>
                  <p v-if="book.author" class="book-author">{{ book.author }}</p>
                </div>
              </li>
            </ul>
          </section>
        </template>
      </template>
    </section>
  </div>
</template>

<style scoped>
.screen {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 40px;
  width: 100%;
  padding: 40px 54px 54px;
}

.about {
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
}

.back {
  display: inline-flex;
  gap: 12px;
  align-items: center;
  align-self: flex-start;
  height: 48px;
  padding: 0 22px;
  border: 1px solid #c4d7e7;
  border-radius: 40px;
  color: #f9fcff;
  font-family: Arimo, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
  text-decoration: none;
}

.back-icon {
  display: block;
  flex-shrink: 0;
  width: 20px;
  max-width: none;
  height: 20px;
}

.photo-frame {
  width: 100%;
  height: 400px;
  overflow: hidden;
  border-radius: 17px;
  background: #c4d7e7;
}

.photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  color: #f9fcff;
}

.heading {
  font-family: Lora, Georgia, serif;
  font-size: 62px;
  font-weight: 400;
  line-height: 1.1;
  color: #f9fcff;
}

.description {
  max-width: 930px;
  font-family: Arimo, Arial, sans-serif;
  font-size: 19px;
  font-weight: 400;
  line-height: 1.55;
}

.address {
  font-family: Arimo, Arial, sans-serif;
  font-size: 18px;
  font-weight: 400;
  line-height: 1.5;
}

.books {
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
}

.books-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  width: 100%;
  color: #f9fcff;
}

.books-title {
  font-family: Lora, Georgia, serif;
  font-size: 34px;
  font-weight: 400;
  line-height: 1.4;
  color: #f9fcff;
}

.books-count,
.books-state {
  margin: 0;
  font-family: Arimo, Arial, sans-serif;
  font-weight: 400;
  color: #f9fcff;
}

.books-count {
  font-size: 16px;
  line-height: normal;
}

.books-state {
  font-size: 19px;
  line-height: 1.55;
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 27px;
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
}

.card {
  display: flex;
  flex-direction: column;
  gap: 15px;
  height: 402px;
  padding: 16px;
  overflow: hidden;
  border-radius: 17px;
  background: #c4d7e7;
}

.cover-frame {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 263px;
  overflow: hidden;
  border-radius: 6px;
  background: #f2f8fe;
}

.cover {
  display: flex;
  flex-direction: column;
  gap: 7px;
  width: 166px;
  height: 233px;
  padding: 13px 12px 0;
  overflow: hidden;
  background: #f4eedc;
  box-shadow: 3px 5px 10px rgb(36 74 115 / 16%);
}

.cover-author,
.cover-title {
  margin: 0;
  color: #244a73;
  text-align: center;
}

.cover-author {
  font-family: Arimo, Arial, sans-serif;
  font-size: 10px;
  font-weight: 400;
  line-height: normal;
}

.cover-title {
  display: -webkit-box;
  overflow: hidden;
  font-family: Lora, Georgia, serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 1.1;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.meta {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  padding: 0 3px;
}

.book-title {
  height: 51px;
  margin: 0;
  overflow: hidden;
  font-family: Lora, Georgia, serif;
  font-size: 23px;
  font-weight: 400;
  line-height: 1.1;
  color: #244a73;
}

.book-author {
  margin: 0;
  overflow: hidden;
  font-family: Arimo, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.3;
  color: #6184ab;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.notice {
  margin: 0;
  color: #f9fcff;
  font-family: Arimo, Arial, sans-serif;
  font-size: 19px;
  line-height: 1.45;
}

.notice--error {
  display: grid;
  gap: 12px;
  justify-items: start;
}

.retry {
  border: 0;
  border-radius: 40px;
  background: #809fc0;
  color: #fff;
  font-family: Arimo, Arial, sans-serif;
  font-size: 16px;
}

.retry:hover {
  background: #809fc0;
}

@media (max-width: 1100px) {
  .content {
    padding: 32px 24px 40px;
  }

  .heading {
    font-size: 48px;
  }

  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .heading {
    font-size: 40px;
  }

  .photo-frame {
    height: 220px;
  }

  .grid {
    grid-template-columns: 1fr;
  }

  .card {
    height: auto;
  }
}
</style>
