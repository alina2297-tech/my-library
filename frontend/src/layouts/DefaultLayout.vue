<script setup lang="ts">
import MainHeader from '@/layouts/MainHeader.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const isStorageSection = computed(
  () => route.name === 'storage-locations' || route.name === 'storage-location-detail',
)
const isLocationsPage = computed(() => route.name === 'storage-locations')
const isLocationDetailPage = computed(() => route.name === 'storage-location-detail')
const isLibraryCanvas = computed(() => isLocationsPage.value || isLocationDetailPage.value)
</script>

<template>
  <div class="layout" :class="{ 'layout--locations': isLibraryCanvas }">
    <MainHeader v-if="isLocationsPage" />
    <header v-else-if="!isLocationDetailPage" class="header">
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
    <main class="main" :class="{ 'main--flush': isLibraryCanvas }">
      <slot />
    </main>
  </div>
</template>
