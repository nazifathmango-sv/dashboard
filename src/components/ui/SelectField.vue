<template>
  <div>
    <label v-if="label" class="text-xs font-semibold text-navy-300 uppercase tracking-wide">
      {{ label }}
    </label>
    <select
      :value="modelValue"
      :required="required"
      :disabled="disabled"
      class="w-full mt-1 px-4 py-2.5 bg-sand-50 border rounded-xl text-sm text-navy-500 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-sand-100"
      :class="invalid ? 'border-coral-400 focus-visible:ring-coral-400' : 'border-sand-300 focus-visible:ring-gold-400'"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <slot />
    </select>
    <p v-if="invalid && error" class="mt-1 text-xs text-coral-500">{{ error }}</p>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  modelValue: string | number
  label?: string
  required?: boolean
  invalid?: boolean
  error?: string
  disabled?: boolean
}>()
defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>
