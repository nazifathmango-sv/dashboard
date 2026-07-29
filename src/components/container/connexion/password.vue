<template>
  <div class="flex h-screen w-screen overflow-hidden bg-sand-50 font-sans">
    <div class="hidden w-1/2 h-full bg-navy-600 md:flex items-center justify-center">
      <img :src="Img" alt="Hôtel SunBeach" class="w-full h-full object-cover" />
    </div>
    <div class="w-full md:w-1/2 h-full flex items-center justify-center p-6">
      <div
        class="w-full max-w-md bg-white rounded-3xl p-8 shadow-sm border border-sand-200 flex flex-col items-center"
      >
        <h1 class="mb-1 text-center text-3xl font-bold text-navy-500 tracking-tight">SunBeach Hotel</h1>
        <p class="mb-8 text-center text-sm text-navy-300">
          Recevez un lien pour réinitialiser votre mot de passe.
        </p>

        <form v-if="!success" class="w-full space-y-5" @submit.prevent="handleSubmit">
          <FormField
            v-model="email"
            type="email"
            label="Adresse email"
            placeholder="exemple@gmail.com"
            required
            :invalid="!!errorMessage"
            :error="errorMessage"
          />

          <BaseButton type="submit" class="w-full" :loading="loading">Envoyer l'adresse</BaseButton>

          <div class="text-center">
            <RouterLink
              to="/login"
              class="text-xs font-medium text-navy-300 hover:text-navy-500 hover:underline transition-colors duration-150 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2"
            >
              Retour à la page de connexion
            </RouterLink>
          </div>
        </form>

        <div v-else class="w-full space-y-5 text-center">
          <p class="text-sm text-navy-400" role="status">
            Si un compte existe pour <span class="font-semibold">{{ email }}</span>, un email contenant un lien de
            réinitialisation vient de lui être envoyé.
          </p>
          <RouterLink to="/login" class="block w-full">
            <BaseButton type="button" class="w-full">Retour à la connexion</BaseButton>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/firebase'
import Img from '@/assets/img/pe.webp'
import BaseButton from '@/components/ui/BaseButton.vue'
import FormField from '@/components/ui/FormField.vue'

const email = ref('')
const loading = ref(false)
const success = ref(false)
const errorMessage = ref('')

const handleSubmit = async () => {
  errorMessage.value = ''
  loading.value = true
  try {
    await sendPasswordResetEmail(auth, email.value.trim(), {
      url: `${window.location.origin}/reset`,
      handleCodeInApp: true,
    })
  } catch (error: any) {
    // On ne révèle jamais si l'email existe ou non (évite l'énumération de comptes) :
    // seule une erreur de format d'email est affichée, le reste aboutit au même message neutre.
    if (error.code === 'auth/invalid-email') {
      errorMessage.value = 'Adresse email invalide'
      loading.value = false
      return
    }
  }
  loading.value = false
  success.value = true
}
</script>
