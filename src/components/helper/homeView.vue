<template>
  <div class="flex h-screen w-full overflow-hidden bg-sand-100">
    <div v-if="sidebarOpen" class="fixed inset-0 z-40 bg-black/40 md:hidden" @click="sidebarOpen = false" />
    <TheSidebar :open="sidebarOpen" @close-sidebar="sidebarOpen = false" />

    <div class="w-full h-screen overflow-y-auto md:ml-0">
      <TheHeader :sidebar-open="sidebarOpen" @toggle-sidebar="toggleSidebar" />
      <main class="main-content">
        <RouterView />
      </main>
    </div>
  </div>
</template>
<script setup lang="ts">
import { RouterView } from 'vue-router'
import { ref } from 'vue'
import TheSidebar from '@/components/helper/sideBar.vue'
import TheHeader from '@/components/helper/header.vue'

const sidebarOpen = ref(false)
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}
</script>
