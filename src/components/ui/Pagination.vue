<template>
  <div v-if="totalPages > 1" class="flex flex-col gap-3 sm:flex-row items-center justify-between px-4 sm:px-6 py-4 bg-white border-t border-sand-200 rounded-b-2xl">
    <p class="text-sm text-navy-300">Page {{ currentPage }} / {{ totalPages }}</p>
    <div class="flex items-center gap-2">
      <BaseButton
        size="sm"
        variant="secondary"
        :disabled="currentPage <= 1"
        @click="$emit('update:currentPage', currentPage - 1)"
      >
        Précédent
      </BaseButton>
      <BaseButton
        size="sm"
        variant="secondary"
        :disabled="currentPage >= totalPages"
        @click="$emit('update:currentPage', currentPage + 1)"
      >
        Suivant
      </BaseButton>
    </div>
  </div>
</template>
<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue'

defineProps<{
  currentPage: number
  totalPages: number
}>()
defineEmits<{
  'update:currentPage': [value: number]
}>()
</script>
