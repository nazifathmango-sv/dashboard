<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full">
    <path v-if="icon === 'bed'" stroke-linecap="round" stroke-linejoin="round" d="M3.75 18v-8.25a2.25 2.25 0 0 1 2.25-2.25h12a2.25 2.25 0 0 1 2.25 2.25V18M3.75 18h16.5M3.75 18v2.25M20.25 18v2.25M6.75 9.75V7.5a1.5 1.5 0 0 1 1.5-1.5h1.5a1.5 1.5 0 0 1 1.5 1.5v2.25m0 0h6" />
    <path v-else-if="icon === 'restaurant'" stroke-linecap="round" stroke-linejoin="round" d="M8.25 3v6.75a2.25 2.25 0 0 1-2.25 2.25h0a2.25 2.25 0 0 1-2.25-2.25V3M7.5 3v18m9-18v9a3 3 0 0 1-3 3h0m3-12v18m-3-6h0" />
    <path v-else-if="icon === 'party'" stroke-linecap="round" stroke-linejoin="round" d="M3 21v-3.6a2.4 2.4 0 0 1 2.4-2.4h13.2a2.4 2.4 0 0 1 2.4 2.4V21M3 21h18M5.25 15V9.75L12 3l6.75 6.75V15" />
    <path v-else-if="icon === 'nightclub'" stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
    <path v-else-if="icon === 'spa'" stroke-linecap="round" stroke-linejoin="round" d="M12 3c1.5 3 4.5 4.5 4.5 8.25a4.5 4.5 0 1 1-9 0C7.5 7.5 10.5 6 12 3Z" />
    <path v-else-if="icon === 'games'" stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-19.5 0v6a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25v-6m-19.5 0h19.5M6.75 15h1.5m3.75 0h.008v.008H12V15Zm3 0h.008v.008H15V15Zm-3 3h.008v.008H12V18Zm3 0h.008v.008H15V18Z" />
    <path v-else-if="icon === 'sport'" stroke-linecap="round" stroke-linejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375" />
  </svg>
</template>
<script setup lang="ts">
import type { ServiceIcon } from '@/data/services'

defineProps<{
  icon: ServiceIcon
}>()
</script>
