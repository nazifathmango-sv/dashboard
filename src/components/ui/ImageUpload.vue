<template>
  <div>
    <label v-if="label" class="text-xs font-semibold text-navy-300 uppercase tracking-wide">
      {{ label }}
    </label>

    <div
      class="mt-1 relative rounded-xl border-2 border-dashed transition-colors duration-200 overflow-hidden"
      :class="isDragging ? 'border-gold-400 bg-gold-50' : 'border-sand-300 bg-sand-50 hover:border-sand-400'"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
    >
      <input
        ref="inputRef"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleFileChange"
      />

      <div v-if="previewUrl" class="relative">
        <img :src="previewUrl" alt="Aperçu" class="w-full h-48 object-cover" />
        <div
          v-if="uploading"
          class="absolute inset-0 bg-navy-900/60 flex flex-col items-center justify-center gap-2 text-white"
        >
          <div class="w-40 h-1.5 rounded-full bg-white/20 overflow-hidden">
            <div class="h-full bg-gold-400 transition-all duration-200" :style="{ width: progress + '%' }"></div>
          </div>
          <p class="text-xs font-medium">Envoi en cours... {{ progress }}%</p>
        </div>
        <div v-else class="absolute top-2 right-2 flex items-center gap-2">
          <button
            type="button"
            title="Changer l'image"
            class="w-8 h-8 rounded-lg bg-navy-900/60 backdrop-blur-sm text-white flex items-center justify-center hover:bg-navy-900/80 transition-colors duration-200 cursor-pointer"
            @click="inputRef?.click()"
          >
            <Icon name="edit" class="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Retirer l'image"
            class="w-8 h-8 rounded-lg bg-navy-900/60 backdrop-blur-sm text-white flex items-center justify-center hover:bg-coral-500/80 transition-colors duration-200 cursor-pointer"
            @click="removeImage"
          >
            <Icon name="trash" class="w-4 h-4" />
          </button>
        </div>
      </div>

      <button
        v-else
        type="button"
        class="w-full h-48 flex flex-col items-center justify-center gap-2 text-navy-300 cursor-pointer"
        @click="inputRef?.click()"
      >
        <Icon name="calendar" class="w-8 h-8 text-navy-200" />
        <p class="text-sm font-medium">Cliquez ou glissez une image ici</p>
        <p class="text-xs text-navy-200">PNG, JPG jusqu'à 5 Mo</p>
      </button>
    </div>

    <p v-if="error" class="mt-1.5 text-xs text-coral-500">{{ error }}</p>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import Icon from '@/components/ui/Icon.vue'

const props = defineProps<{
  modelValue: string
  label?: string
  folder?: string
}>()
const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined

const inputRef = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const uploading = ref(false)
const progress = ref(0)
const error = ref('')
const previewUrl = ref(props.modelValue || '')

watch(
  () => props.modelValue,
  (value) => {
    if (value !== previewUrl.value) previewUrl.value = value || ''
  },
)

const MAX_SIZE = 5 * 1024 * 1024

function uploadFile(file: File) {
  error.value = ''
  if (!file.type.startsWith('image/')) {
    error.value = 'Le fichier doit être une image.'
    return
  }
  if (file.size > MAX_SIZE) {
    error.value = "L'image ne doit pas dépasser 5 Mo."
    return
  }
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    error.value = "L'envoi d'image n'est pas configuré (Cloudinary manquant)."
    return
  }

  previewUrl.value = URL.createObjectURL(file)
  uploading.value = true
  progress.value = 0

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('folder', props.folder ?? 'uploads')

  const xhr = new XMLHttpRequest()
  xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`)

  xhr.upload.addEventListener('progress', (event) => {
    if (event.lengthComputable) {
      progress.value = Math.round((event.loaded / event.total) * 100)
    }
  })

  xhr.addEventListener('load', () => {
    uploading.value = false
    if (xhr.status >= 200 && xhr.status < 300) {
      const data = JSON.parse(xhr.responseText)
      previewUrl.value = data.secure_url
      emit('update:modelValue', data.secure_url)
    } else {
      error.value = "Échec de l'envoi de l'image. Réessayez."
      previewUrl.value = props.modelValue || ''
    }
  })

  xhr.addEventListener('error', () => {
    uploading.value = false
    error.value = "Échec de l'envoi de l'image. Réessayez."
    previewUrl.value = props.modelValue || ''
  })

  xhr.send(formData)
}

function handleFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) uploadFile(file)
  if (inputRef.value) inputRef.value.value = ''
}

function handleDrop(event: DragEvent) {
  isDragging.value = false
  const file = event.dataTransfer?.files?.[0]
  if (file) uploadFile(file)
}

function removeImage() {
  previewUrl.value = ''
  error.value = ''
  emit('update:modelValue', '')
}
</script>
