<script setup lang="ts">
import { ref } from 'vue'
import menuIcon from '@/assets/storage-location-menu.svg'
import { isDisplayablePhoto, type StorageLocation } from '@/types/storageLocation'

defineProps<{
  location: StorageLocation
}>()

const photoFailed = ref(false)
</script>

<template>
  <RouterLink
    class="card"
    :to="{ name: 'storage-location-detail', params: { id: String(location.id) } }"
  >
    <div class="photo-frame">
      <img
        v-if="isDisplayablePhoto(location.photo) && !photoFailed"
        class="photo"
        :src="location.photo"
        :alt="location.title"
        @error="photoFailed = true"
      />
    </div>
    <div class="info">
      <h2 class="title">{{ location.title }}</h2>
      <p class="location">{{ location.description }}</p>
      <div class="meta">
        <p class="location">Расположение: {{ location.address }}</p>
        <img class="menu" :src="menuIcon" alt="" width="11" height="21" />
      </div>
    </div>
  </RouterLink>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  min-height: 285px;
  padding: 16px;
  overflow: hidden;
  border-radius: 17px;
  background: #c4d7e7;
  color: inherit;
  text-decoration: none;
}

.photo-frame {
  flex-shrink: 0;
  width: 100%;
  height: 160px;
  overflow: hidden;
  border-radius: 6px;
  background: #b7cce0;
}

.photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  padding: 0 3px;
}

.title {
  font-family: Lora, Georgia, serif;
  font-size: 23px;
  font-weight: 400;
  line-height: 1.1;
  color: #244a73;
}

.meta {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.location {
  min-width: 0;
  overflow: hidden;
  font-family: Arimo, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
  color: #6184ab;
  text-overflow: ellipsis;
}

.menu {
  flex-shrink: 0;
}
</style>
