import { createRouter, createWebHistory } from 'vue-router'

import ChartsView from '@/views/charts/index.vue'
import RoomsView from '@/views/rooms/index.vue'
import ReservationsView from '@/views/reservation/index.vue'
import CustomersView from '@/views/customers/index.vue'
import ServiceView from '@/views/service/index.vue'
import StaffView from '@/views/staff/index.vue'
import HomeView from '@/components/helper/homeView.vue'
import Login from '@/components/container/connexion/login.vue'
import password from '@/components/container/connexion/password.vue'
import code from '@/components/container/connexion/code.vue'
import reset from '@/components/container/connexion/reset.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    {
      path:'/',
      name:'Login',
      component:Login,
    },
   {
      path:'/password',
      name:'password',
      component:password,
    },

     {
      path:'/code',
      name:'code',
      component:code,
    },
     {
      path:'/reset',
      name:'reset',
      component:reset,
    },



    {
      path: '/',
      component: HomeView,
      children: [
        {
          path: 'charts',
          name: 'charts',
          component: ChartsView,
        },
        {
          path: 'rooms',
          name: 'rooms',
          component: RoomsView,
        },
        {
          path: 'reservation',
          name: 'reservations',
          component: ReservationsView,
        },
        {
          path: 'customers',
          name: 'customers',
          component: CustomersView,
        },
        {
          path: 'service',
          name: 'service',
          component: ServiceView,
        },
        {
          path: 'staff',
          name: 'staff',
          component: StaffView,
        },
      ],
    },
  ],
})
export default router
