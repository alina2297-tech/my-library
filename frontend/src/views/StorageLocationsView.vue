<script setup lang="ts">
import StorageLocationCard from '@/components/StorageLocationCard.vue'
import { useStorageLocationsStore } from '@/stores/storageLocations.store'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

const store = useStorageLocationsStore()
const { locations, isLoading, error } = storeToRefs(store)

function loadLocations(): void {
  void store.fetchLocations()
}

onMounted(loadLocations)
</script>

<template>
  <section class="page">
    <header class="page-header">
      <h1>Места хранения</h1>
      <p>Полки, комнаты и другие места, где лежат книги.</p>
    </header>

    <p v-if="isLoading" class="status" role="status">Загрузка мест хранения…</p>

    <div v-if="error" class="error" role="alert">
      <p>{{ error }}</p>
      <button type="button" :disabled="isLoading" @click="loadLocations">Повторить</button>
    </div>

    <p v-else-if="!isLoading && locations.length === 0" class="status">Мест хранения пока нет.</p>

    <ul v-if="locations.length > 0" class="cards">
      <li v-for="location in locations" :key="location.id">
        <StorageLocationCard :location="location" />
      </li>
    </ul>
  </section>
</template>
