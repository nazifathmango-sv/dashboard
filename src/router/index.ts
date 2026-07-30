import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import ChartsView from '@/views/charts/index.vue'
import RoomsView from '@/views/rooms/index.vue'
import ReservationsView from '@/views/reservation/index.vue'
import CustomersView from '@/views/customers/index.vue'
import ServiceView from '@/views/service/index.vue'
import StaffView from '@/views/staff/index.vue'
import PlanningView from '@/views/planning/index.vue'
import IncidentsView from '@/views/incidents/index.vue'
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
      path: '/charts',
      component: HomeView,

      children: [

        // Accessible par tous les employés connectés
        {
          path: '',
          name: 'charts',
          component: ChartsView,
          meta:{
            roles:[
              "administrateur",
              "receptionniste"
            ]
          }
        },


        {
          path: 'rooms',
          name: 'rooms',
          component: RoomsView,
          meta:{
            roles:[
              "administrateur",
              "receptionniste"
            ]
          }
        },


        {
          path: 'reservation',
          name: 'reservations',
          component: ReservationsView,
          meta:{
            roles:[
              "administrateur",
              "receptionniste"
            ]
          }
        },


        {
          path: 'planning',
          name: 'planning',
          component: PlanningView,
          meta:{
            roles:[
              "administrateur",
              "receptionniste"
            ]
          }
        },

        {
          path: 'incidents',
          name: 'incidents',
          component: IncidentsView,
          meta:{
            roles:[
              "administrateur"
            ]
          }
        },


        {
          path: 'customers',
          name: 'customers',
          component: CustomersView,
          meta:{
            roles:[
              "administrateur",
              "receptionniste"
            ]
          }
        },


        {
          path: 'service',
          name: 'service',
          component: ServiceView,
          meta:{
            roles:[
              "administrateur",
              "receptionniste"
            ]
          }
        },
        {
          path: 'staff',
          name: 'staff',
          component: StaffView,
          meta:{
            roles:[
              "administrateur"
            ]
          }
        },


        {
          path: 'admin',
          name: 'admin',
          component: AdminView,
          meta:{
            roles:[
              "administrateur"
            ]
          }
        },


        {
          path: 'reservation/:id',
          name: 'reservation-details',
          component: () =>
            import('@/components/container/reservation/details.vue'),
          meta:{
            roles:[
              "administrateur",
              "receptionniste"
            ]
          }
        },


        {
          path: 'service/:slug',
          name: 'service-details',
          component: () =>
            import('@/views/serviceDetail/index.vue'),
          meta:{
            roles:[
              "administrateur",
              "receptionniste"
            ]
          }
        },


        {
          path: 'customers/:id',
          name: 'customer-details',
          component: () =>
            import('@/views/customerDetail/index.vue'),
          meta:{
            roles:[
              "administrateur",
              "receptionniste"
            ]
          }
        },

      ],
    },

  ],

})

router.beforeEach(async (to, from, next) => {

  if (!to.meta.roles) {
    next()
    return
  }

  const authStore = useAuthStore()
  await authStore.waitUntilReady()

  const role = authStore.role

  if (!role) {
    next('/login')
    return
  }

  const allowedRoles = to.meta.roles as string[]

  if (!allowedRoles.includes(role)) {
    next('/charts')
    return
  }

  next()

})


export default router
