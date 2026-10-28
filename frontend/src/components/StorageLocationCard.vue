<script setup lang="ts">
import { ref } from 'vue'
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
    <img
      v-if="isDisplayablePhoto(location.photo) && !photoFailed"
      class="photo"
      :src="location.photo"
      :alt="location.title"
      @error="photoFailed = true"
    />
    <div class="body">
      <h2>{{ location.title }}</h2>
      <p v-if="location.description" class="description">{{ location.description }}</p>
      <p v-if="location.address" class="address">{{ location.address }}</p>
    </div>
  </RouterLink>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: var(--surface);
  color: inherit;
  text-decoration: none;
  box-shadow: var(--shadow);
}

.card:hover {
  border-color: #cfc3b4;
}

.photo {
  width: 100%;
  height: 11rem;
  object-fit: cover;
}

.body {
  display: grid;
  gap: 0.6rem;
  padding: 1rem 1.05rem 1.1rem;
}

.description,
.address {
  color: var(--muted);
}

.address {
  font-size: 0.95rem;
}
</style>
