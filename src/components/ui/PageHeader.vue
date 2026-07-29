<template>
  <div class="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
    <div>
      <button
        v-if="backTo"
        type="button"
        class="mb-2 inline-flex items-center gap-1 text-sm font-semibold text-navy-300 hover:text-navy-500 transition-colors duration-200 cursor-pointer rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2"
        @click="$emit('back')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Retour
      </button>
      <h1 class="text-2xl font-bold text-navy-500 tracking-tight">
        {{ title }}
      </h1>
      <p v-if="subtitle" class="text-navy-300 mt-1 text-sm">
        {{ subtitle }}
      </p>
    </div>
    <div v-if="$slots.actions" class="flex items-center gap-3">
      <slot name="actions" />
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
  backTo?: boolean
}>()
defineEmits<{
  back: []
}>()
</script>
