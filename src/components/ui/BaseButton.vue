<template>
  <button
    :type="type"
    class="inline-flex items-center justify-center gap-2 rounded-xl font-medium transition cursor-pointer whitespace-nowrap hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
    :class="[sizeClasses, variantClasses]"
  >
    <slot />
  </button>
</template>
<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
    size?: 'sm' | 'md'
    type?: 'button' | 'submit'
  }>(),
  {
    variant: 'primary',
    size: 'md',
    type: 'button',
  },
)

const sizeClasses = computed(() => {
  return props.size === 'sm' ? 'px-3 py-2 text-sm' : 'px-5 py-2.5 text-sm'
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'secondary':
      return 'bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-sm'
    case 'danger':
      return 'bg-red-600 text-white hover:bg-red-700 shadow-sm'
    case 'ghost':
      return 'bg-transparent text-gray-500 hover:bg-gray-100 shadow-none'
    case 'primary':
    default:
      return 'bg-gray-900 text-white hover:bg-gray-700 shadow-sm'
  }
})
</script>
