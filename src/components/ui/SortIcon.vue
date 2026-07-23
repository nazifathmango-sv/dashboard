<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="2.5"
    stroke="currentColor"
    class="w-3 h-3 shrink-0 transition-transform duration-200"
    :class="[active ? 'opacity-100' : 'opacity-30', active && direction === 'desc' ? 'rotate-180' : '']"
  >
    <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
</template>
<script setup lang="ts">
defineProps<{
  active: boolean
  direction: 'asc' | 'desc'
}>()
</script>
