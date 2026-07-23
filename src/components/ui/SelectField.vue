<template>
  <div>
    <label v-if="label" class="text-xs font-semibold text-gray-500 uppercase">
      {{ label }}
    </label>
    <select
      :value="modelValue"
      :required="required"
      class="w-full mt-1 px-4 py-2.5 bg-gray-50 border rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:bg-white transition"
      :class="invalid ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-gray-800'"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <slot />
    </select>
    <p v-if="invalid && error" class="mt-1 text-xs text-red-600">{{ error }}</p>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  modelValue: string | number
  label?: string
  required?: boolean
  invalid?: boolean
  error?: string
}>()
defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>
