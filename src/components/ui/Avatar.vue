<template>
  <div
    class="rounded-full bg-navy-500 text-gold-200 flex items-center justify-center font-semibold shrink-0"
    :class="sizeClasses"
  >
    {{ initial }}
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    name: string
    size?: 'sm' | 'md' | 'lg'
  }>(),
  {
    size: 'sm',
  },
)

const initial = computed(() => props.name.trim().charAt(0).toUpperCase())

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'lg':
      return 'w-20 h-20 text-2xl'
    case 'md':
      return 'w-12 h-12 text-lg'
    case 'sm':
    default:
      return 'w-9 h-9 text-sm'
  }
})
</script>
