<template>
  <section class="hero">
    <h1>Домашняя библиотека</h1>
    <p class="lede">Каталог мест, где хранятся книги: полки, комнаты и шкафы.</p>
    <RouterLink class="button" :to="{ name: 'storage-locations' }">
      Перейти к местам хранения
    </RouterLink>
  </section>
</template>
