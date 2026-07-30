<template>
  <div>
    <label v-if="label" class="text-xs font-semibold text-navy-300 uppercase tracking-wide">
      {{ label }}
    </label>
    <textarea
      v-if="multiline"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      rows="4"
      class="w-full mt-1 px-4 py-2.5 bg-sand-50 border rounded-xl text-sm text-navy-500 placeholder:text-navy-200 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus:bg-white resize-none disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-sand-100"
      :class="invalid ? 'border-coral-400 focus-visible:ring-coral-400' : 'border-sand-300 focus-visible:ring-gold-400'"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    ></textarea>
    <input
      v-else
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      class="w-full mt-1 px-4 py-2.5 bg-sand-50 border rounded-xl text-sm text-navy-500 placeholder:text-navy-200 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-sand-100"
      :class="invalid ? 'border-coral-400 focus-visible:ring-coral-400' : 'border-sand-300 focus-visible:ring-gold-400'"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      v-bind="$attrs"
    />
    <p v-if="invalid && error" class="mt-1 text-xs text-coral-500">{{ error }}</p>
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
    disabled?: boolean
  }>(),
  {
    type: 'text',
  },
)
defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>
