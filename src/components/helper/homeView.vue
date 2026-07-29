<template>
  <div class="flex h-screen w-full overflow-hidden bg-sand-100">
    <TheSidebar />
    <div class="w-full h-screen overflow-y-auto">
      <TheHeader />
      <main class="main-content">
        <RouterView />
      </main>
    </div>
  </div>
</template>
<script setup lang="ts">
import { RouterView } from 'vue-router'
import TheSidebar from '@/components/helper/sideBar.vue'
import TheHeader from '@/components/helper/header.vue'

</script>
