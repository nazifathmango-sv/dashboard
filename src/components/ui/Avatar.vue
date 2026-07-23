<template>
  <div
    class="rounded-full bg-gray-900 text-white flex items-center justify-center font-semibold shrink-0"
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
    size?: 'sm' | 'md'
  }>(),
  {
    size: 'sm',
  },
)

const initial = computed(() => props.name.trim().charAt(0).toUpperCase())

const sizeClasses = computed(() => (props.size === 'md' ? 'w-12 h-12 text-lg' : 'w-9 h-9 text-sm'))
</script>
