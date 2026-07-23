<template>
  <div>
    <label v-if="label" class="text-xs font-semibold text-gray-500 uppercase">
      {{ label }}
    </label>
    <textarea
      v-if="multiline"
      :value="modelValue"
      :placeholder="placeholder"
      rows="4"
      class="w-full mt-1 px-4 py-2.5 bg-gray-50 border rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:bg-white transition resize-none"
      :class="invalid ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-gray-800'"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    ></textarea>
    <input
      v-else
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      class="w-full mt-1 px-4 py-2.5 bg-gray-50 border rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:bg-white transition"
      :class="invalid ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-gray-800'"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <p v-if="invalid && error" class="mt-1 text-xs text-red-600">{{ error }}</p>
  </div>
</template>
<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: string
    label?: string
    type?: string
    placeholder?: string
    required?: boolean
    invalid?: boolean
    error?: string
    multiline?: boolean
  }>(),
  {
    type: 'text',
  },
)
defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>
