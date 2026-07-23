<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100" :class="paddingClass">
    <slot />
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    padding?: 'sm' | 'md' | 'none'
  }>(),
  {
    padding: 'md',
  },
)

const paddingClass = computed(() => {
  switch (props.padding) {
    case 'sm':
      return 'p-4'
    case 'none':
      return ''
    case 'md':
    default:
      return 'p-6'
  }
})
</script>
