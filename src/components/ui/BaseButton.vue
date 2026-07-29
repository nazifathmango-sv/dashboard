<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    class="relative inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors duration-200 cursor-pointer whitespace-nowrap hover:-translate-y-0.5 active:translate-y-0 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
    :class="[sizeClasses, variantClasses, loading && 'cursor-wait']"
  >
    <svg
      v-if="loading"
      class="w-4 h-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
    </svg>
    <slot v-else />
  </button>
</template>
<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
    size?: 'sm' | 'md'
    type?: 'button' | 'submit'
    disabled?: boolean
    loading?: boolean
  }>(),
  {
    variant: 'primary',
    size: 'md',
    type: 'button',
    disabled: false,
    loading: false,
  },
)

const sizeClasses = computed(() => {
  return props.size === 'sm' ? 'px-3 py-2 text-sm' : 'px-5 py-2.5 text-sm'
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'secondary':
      return 'bg-sand-100 text-navy-500 hover:bg-sand-200 shadow-sm focus-visible:ring-navy-300'
    case 'danger':
      return 'bg-coral-500 text-white hover:bg-coral-400 shadow-sm focus-visible:ring-coral-400'
    case 'ghost':
      return 'bg-transparent text-navy-300 hover:bg-sand-100 hover:text-navy-500 shadow-none focus-visible:ring-navy-300'
    case 'primary':
    default:
      return 'bg-navy-500 text-sand-50 hover:bg-navy-400 shadow-sm focus-visible:ring-gold-400'
  }
})
</script>
