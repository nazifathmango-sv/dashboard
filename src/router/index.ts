import { createRouter, createWebHistory } from 'vue-router'
import ChartsView from '@/views/charts/index.vue'
import RoomsView from '@/views/rooms/index.vue'
import ReservationsView from '@/views/reservation/index.vue'
import CustomersView from '@/views/customers/index.vue'
import ServiceView from '@/views/service/index.vue'
import StaffView from '@/views/staff/index.vue'
import PlanningView from '@/views/planning/index.vue'
import HomeView from '@/components/helper/homeView.vue'
import Login from '@/components/container/connexion/login.vue'
import password from '@/components/container/connexion/password.vue'
import reset from '@/components/container/connexion/reset.vue'
import AdminView from '@/views/admin/index.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
      {
    path: '/',
    redirect: '/login',
  },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/password',
      name: 'password',
      component: password,
    },
    {
      path: '/reset',
      name: 'reset',
      component: reset,
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
          path: '/planning',
          name: 'planning',
          component: PlanningView,
        },
        {
          path: '/customers',
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
        {
  path: 'admin',
  name: 'admin',
  component: AdminView,
  meta: {
    requiresAdmin: true
  }
},
        {
          path: '/reservation/:id',
          name: 'reservation-details',
          component: () => import('@/components/container/reservation/details.vue'),
        },
        {
          path: '/service/:slug',
          name: 'service-details',
          component: () => import('@/views/serviceDetail/index.vue'),
        },
        {
          path: '/customers/:id',
          name: 'customer-details',
          component: () => import('@/views/customerDetail/index.vue'),
        },
      ],
    },
  ],
})
router.beforeEach((to, from, next) => {

  const role = localStorage.getItem('roleUtilisateur')


  if (to.meta.requiresAdmin && role !== 'administrateur') {

    next('/charts')

  } else {

    next()

  }

})
export default router
