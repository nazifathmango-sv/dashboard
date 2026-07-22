<template>
  <div class="flex h-screen w-full overflow-hidden bg-slate-100">
    <TheSidebar />
    <div class="w-full h-screen overflow-y-auto">
      <TheHeader class="sticky top-0 z-50" />
      <div class="main-content">
        <RouterView />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import TheSidebar from '@/components/helper/sideBar.vue'
import TheHeader from '@/components/helper/header.vue'
</script>
