<script setup lang="ts">
import addIcon from '@/assets/add-storage-location.svg'
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
  <section class="locations">
    <header class="intro">
      <div class="copy">
        <h1 class="heading">Места хранения</h1>
        <p class="description">
          Здесь вы можете управлять местами, где хранятся ваши книги. Добавляйте новые локации,
          редактируйте и просматривайте информацию.
        </p>
      </div>
      <button type="button" class="add">
        <img class="add-icon" :src="addIcon" alt="" width="79" height="79" />
        <span class="add-label">Добавить место хранения</span>
      </button>
    </header>

    <p v-if="isLoading" class="status" role="status">Загрузка мест хранения…</p>

    <div v-if="error" class="error" role="alert">
      <p>{{ error }}</p>
      <button type="button" class="retry" :disabled="isLoading" @click="loadLocations">
        Повторить
      </button>
    </div>

    <p v-else-if="!isLoading && locations.length === 0" class="status">Мест хранения пока нет.</p>

    <ul v-if="locations.length > 0" class="cards">
      <li v-for="location in locations" :key="location.id">
        <StorageLocationCard :location="location" />
      </li>
    </ul>
  </section>
</template>

<style scoped>
.locations {
  display: flex;
  flex-direction: column;
  gap: 32px;
  align-items: flex-start;
  width: 100%;
  padding: 40px 54px 48px;
}

.intro {
  display: flex;
  gap: 24px;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  min-height: 171px;
}

.copy {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: min(650px, 100%);
}

.heading {
  font-family: Lora, Georgia, serif;
  font-size: 62px;
  font-weight: 400;
  line-height: 1.1;
  color: #f9fcff;
}

.description {
  max-width: 560px;
  font-family: Arimo, Arial, sans-serif;
  font-size: 19px;
  font-weight: 400;
  line-height: 1.45;
  color: #f9fcff;
}

.add {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 15px;
  align-items: center;
  width: 158px;
  margin: 0;
  padding: 8px 0 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: #f9fcff;
  cursor: pointer;
}

.add:hover {
  background: transparent;
}

.add-icon {
  flex-shrink: 0;
  transition: all .3s ease-in-out;
}

.add-icon:hover {
  transform: scale(1.1);
}

.add-label {
  font-family: Arimo, Arial, sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 1.4;
  text-align: center;
}

.status {
  font-family: Arimo, Arial, sans-serif;
  font-size: 19px;
  color: #f9fcff;
}

.error {
  display: grid;
  gap: 12px;
  justify-items: start;
  color: #f9fcff;
}

.retry {
  border: 0;
  border-radius: 40px;
  background: #809fc0;
  color: #fff;
  font-family: Arimo, Arial, sans-serif;
  font-size: 16px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 27px;
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
}

@media (max-width: 1100px) {
  .locations {
    padding: 32px 24px 40px;
  }

  .heading {
    font-size: 48px;
  }

  .cards {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .intro {
    flex-direction: column;
    min-height: 0;
  }

  .heading {
    font-size: 40px;
  }

  .add {
    align-items: flex-start;
    width: auto;
    padding-top: 0;
  }

  .add-label {
    text-align: left;
  }

  .cards {
    grid-template-columns: 1fr;
  }
}
</style>
