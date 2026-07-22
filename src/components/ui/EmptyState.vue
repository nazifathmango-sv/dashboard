<template>
  <div class="flex flex-col items-center justify-center text-center py-16 px-6">
    <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-gray-400">
        <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
    </div>
    <p class="text-gray-700 font-medium">{{ title }}</p>
    <p v-if="description" class="text-gray-500 text-sm mt-1 max-w-sm">{{ description }}</p>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>
