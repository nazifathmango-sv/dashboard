<template>
  <div class="flex h-screen w-screen overflow-hidden bg-gray-50">
    <div class="hidden w-1/2 h-full bg-[#0f4c9c] md:flex items-center justify-center">
      <img :src="Img" alt="mango" class="w-full h-full object-cover" />
    </div>
    <div class="w-full md:w-1/2 h-full flex items-center justify-center p-6">
      <div
        class="w-full max-w-md bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col items-center"
      >
        <div class="mb-2 text-center text-4xl font-bold">SunBeach Hotel</div>
        <div class="w-full m-8 space-y-5">
          <FormField v-model="newPassword" type="password" label="Nouveau mot de passe" placeholder=".........." />
          <FormField
            v-model="confirmPassword"
            type="password"
            label="Confirmez le nouveau mot de passe"
            placeholder=".........."
          />
          <RouterLink to="/login" class="block w-full">
            <BaseButton type="submit" class="w-full">Modifier</BaseButton>
          </RouterLink>
          <div class="text-center">
            <RouterLink to="/login">
              <button class="text-xs text-gray-600 hover:underline font-medium cursor-pointer">
                Retour à la page de connexion
              </button>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import Img from '@/assets/img/pe.webp'
import BaseButton from '@/components/ui/BaseButton.vue'
import FormField from '@/components/ui/FormField.vue'

const newPassword = ref('')
const confirmPassword = ref('')
</script>
