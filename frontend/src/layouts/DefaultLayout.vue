<script setup lang="ts">
import StorageLocationsHeader from '@/components/StorageLocationsHeader.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const isStorageSection = computed(
  () => route.name === 'storage-locations' || route.name === 'storage-location-detail',
)
const isLocationsPage = computed(() => route.name === 'storage-locations')
</script>

<template>
  <div class="layout" :class="{ 'layout--locations': isLocationsPage }">
    <StorageLocationsHeader v-if="isLocationsPage" />
    <header v-else class="header">
      <RouterLink class="brand" :to="{ name: 'home' }">Домашняя библиотека</RouterLink>
      <nav class="nav" aria-label="Основная навигация">
        <RouterLink :to="{ name: 'home' }">Главная</RouterLink>
        <RouterLink
          :to="{ name: 'storage-locations' }"
          :class="{ 'is-current': isStorageSection }"
          :aria-current="isStorageSection ? 'page' : undefined"
        >
          Места хранения
        </RouterLink>
      </nav>
    </header>
    <main class="main" :class="{ 'main--flush': isLocationsPage }">
      <slot />
    </main>
  </div>
</template>
