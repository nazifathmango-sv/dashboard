import { createRouter, createWebHistory } from 'vue-router'
import TableauView from '@/views/tableau/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'tableau',
      component: TableauView,
    },
  ],
})

export default router
