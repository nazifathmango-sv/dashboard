<template>
  <div class="HomeView">
    <div class="begin">
      <div class="content">
        <div class="flex h-screen w-full overflow-hidden bg-slate-100">
          <div class="sidebar">
            <TheSidebar />
          </div>
          <div class="bg- w-full h-screen overflow-y-scroll">
            <div class="header fixed z-50 ">
              <TheHeader />
            </div>
            <br />
            <div class="main-content my-32 2xl:my-24 2xl:p-10">
              <RouterView />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import TheSidebar from '@/components/helper/sideBar.vue'
import TheHeader from '@/components/helper/header.vue'
</script>
<style scoped>
.header {
  width: -webkit-fill-available;
}
</style>
