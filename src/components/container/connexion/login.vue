<template>
  <div class="flex h-screen w-screen overflow-hidden bg-gray-50">
    <div class="hidden w-1/2 h-full bg-[#0f4c9c] md:flex items-center justify-center">
      <img :src="Img" alt="mango" class="w-full h-full object-cover" />
    </div>
    <div class="w-full md:w-1/2 h-full flex items-center justify-center p-6">
      <div class="w-full max-w-md bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col items-center">
        <div class="mb-2 text-center text-4xl font-bold">SunBeach Hotel</div>
        <div class="w-full m-8 space-y-5">
          <FormField v-model="email" type="email" label="Adresse email" placeholder="exemple@gmail.com" />
          <FormField v-model="password" type="password" label="Mot de passe" placeholder="..........." />
          <div class="text-center">
            <RouterLink to="/password">
              <button class="text-xs text-gray-600 hover:underline font-medium cursor-pointer">
                Mot de passe oublié ?
              </button>
            </RouterLink>
          </div>
          <RouterLink to="/charts" class="block w-full">
            <BaseButton type="submit" class="w-full">Connexion</BaseButton>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import Img from '@/assets/img/pe.webp'
import BaseButton from '@/components/ui/BaseButton.vue'
import FormField from '@/components/ui/FormField.vue'

const email = ref('')
const password = ref('')
</script>
