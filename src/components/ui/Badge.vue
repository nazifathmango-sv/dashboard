<template>
  <span class="inline-block px-3 py-1 text-xs rounded-lg border font-semibold transition-colors duration-150" :class="toneClasses">
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
      return 'bg-navy-50 text-navy-400 border-navy-100'
    case 'green':
      return 'bg-lagoon-50 text-lagoon-500 border-lagoon-100'
    case 'red':
      return 'bg-coral-50 text-coral-500 border-coral-100'
    case 'amber':
      return 'bg-gold-50 text-gold-600 border-gold-100'
    case 'gray':
    default:
      return 'bg-sand-100 text-navy-400 border-sand-200'
  }
})
</script>
