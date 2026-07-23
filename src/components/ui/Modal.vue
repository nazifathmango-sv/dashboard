<template>
  <Transition name="modal">
    <div
      v-if="modelValue"
      @click="$emit('update:modelValue', false)"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <div
        @click.stop
        class="modal-card bg-white p-6 rounded-2xl shadow-xl w-full mx-4 overflow-y-auto max-h-[90vh]"
        :class="size === 'sm' ? 'max-w-sm' : 'max-w-lg'"
      >
        <slot />
      </div>
    </div>
  </Transition>
</template>
<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: boolean
    size?: 'sm' | 'lg'
  }>(),
  {
    size: 'lg',
  },
)
defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>
<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-active .modal-card,
.modal-leave-active .modal-card {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .modal-card,
.modal-leave-to .modal-card {
  opacity: 0;
  transform: scale(0.95);
}
</style>
