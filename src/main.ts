import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueApexCharts from "vue3-apexcharts"

import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'

const app = createApp(App)
app.use(VueApexCharts)
app.use(createPinia())
app.use(router)

useAuthStore().start()

app.mount('#app')
