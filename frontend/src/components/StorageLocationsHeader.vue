<script setup lang="ts">
import bookIcon from '@/assets/logo-book.svg'
import profileIcon from '@/assets/header-profile.svg'
import searchIcon from '@/assets/header-search.svg'
</script>

<template>
  <header class="bar">
    <RouterLink class="logo" :to="{ name: 'home' }">
      <span class="logo-mark">
        <img :src="bookIcon" alt="" />
      </span>
      <span class="logo-title">Моя библиотека</span>
    </RouterLink>

    <nav class="menu" aria-label="Основная навигация">
      <span class="item">Книги</span>
      <span class="item">Авторы</span>
      <span class="item">Жанры</span>
      <RouterLink
        class="item item--current"
        :to="{ name: 'storage-locations' }"
        aria-current="page"
      >
        Места хранения
      </RouterLink>
    </nav>

    <div class="actions">
      <button type="button" class="icon-button" aria-label="Поиск">
        <img :src="searchIcon" alt="" width="29" height="29" />
      </button>
      <button type="button" class="icon-button" aria-label="Профиль">
        <img :src="profileIcon" alt="" width="46" height="46" />
      </button>
    </div>
  </header>
</template>

<style scoped>
.bar {
  display: flex;
  align-items: center;
  width: 100%;
  height: 106px;
  padding: 0 54px;
}

.logo {
  display: flex;
  flex-shrink: 0;
  gap: 12px;
  align-items: center;
  width: 470px;
  color: #f9fcff;
  text-decoration: none;
}

.logo-mark {
  position: relative;
  flex-shrink: 0;
  width: 44px;
  height: 40px;
}

.logo-mark img {
  position: absolute;
  top: 0;
  left: 4px;
  width: auto;
  max-width: none;
  height: auto;
}

.logo-title {
  font-family: Lora, Georgia, serif;
  font-size: 30px;
  font-weight: 400;
  line-height: normal;
  white-space: nowrap;
}

.menu {
  display: flex;
  flex-shrink: 0;
  gap: 54px;
  align-items: flex-start;
  height: 48px;
}

.item {
  margin-top: 13.5px;
  color: #f9fcff;
  font-family: Arimo, Arial, sans-serif;
  font-size: 18px;
  font-weight: 400;
  line-height: normal;
  white-space: nowrap;
  text-decoration: none;
}

.item--current {
  display: flex;
  flex-direction: column;
  gap: 11px;
  align-items: stretch;
  height: 48px;
  margin-top: 0;
  padding-top: 14px;
}

.item--current::after {
  content: '';
  height: 2px;
  background: #f9fcff;
}

.actions {
  display: flex;
  flex: 1;
  gap: 72px;
  align-items: center;
  justify-content: flex-end;
  min-width: 0;
}

.icon-button {
  width: auto;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  cursor: pointer;
}

.icon-button:hover {
  background: transparent;
}

.icon-button img {
  width: auto;
  max-width: none;
  height: auto;
}

@media (max-width: 1200px) {
  .bar {
    flex-wrap: wrap;
    gap: 20px 32px;
    height: auto;
    padding: 24px;
  }

  .logo {
    width: auto;
  }

  .menu {
    gap: 28px;
    height: auto;
  }

  .actions {
    gap: 32px;
  }
}

@media (max-width: 720px) {
  .logo-title {
    font-size: 24px;
  }

  .menu {
    flex-wrap: wrap;
    gap: 16px 24px;
  }
}
</style>
