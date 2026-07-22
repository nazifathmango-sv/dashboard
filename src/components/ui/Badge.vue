<template>
  <span class="inline-block px-3 py-1 text-xs rounded-lg border font-medium" :class="toneClasses">
    <slot />
  </span>
</template>
<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    tone?: 'blue' | 'green' | 'red' | 'gray' | 'amber'
  }>(),
  {
    tone: 'gray',
  },
)

const toneClasses = computed(() => {
  switch (props.tone) {
    case 'blue':
      return 'bg-blue-50 text-blue-700 border-blue-100'
    case 'green':
      return 'bg-green-50 text-green-700 border-green-100'
    case 'red':
      return 'bg-red-50 text-red-700 border-red-100'
    case 'amber':
      return 'bg-amber-50 text-amber-700 border-amber-100'
    case 'gray':
    default:
      return 'bg-gray-100 text-gray-600 border-gray-200'
  }
})
</script>
