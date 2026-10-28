import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import StorageLocationDetailView from '@/views/StorageLocationDetailView.vue'
import StorageLocationsView from '@/views/StorageLocationsView.vue'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { title: 'Главная' },
  },
  {
    path: '/storage-locations',
    name: 'storage-locations',
    component: StorageLocationsView,
    meta: { title: 'Места хранения' },
  },
  {
    path: '/storage-locations/:id',
    name: 'storage-location-detail',
    component: StorageLocationDetailView,
    meta: { title: 'Место хранения' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.afterEach((to) => {
  const pageTitle = typeof to.meta.title === 'string' ? to.meta.title : ''
  document.title = pageTitle ? `${pageTitle} · Домашняя библиотека` : 'Домашняя библиотека'
})

export default router
