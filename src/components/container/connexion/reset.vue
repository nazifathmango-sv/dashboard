<template>
  <div class="flex h-screen w-screen overflow-hidden bg-sand-50 font-sans">
    <div class="hidden w-1/2 h-full bg-navy-600 md:flex items-center justify-center">
      <img :src="Img" alt="Hôtel SunBeach" class="w-full h-full object-cover" />
    </div>
    <div class="w-full md:w-1/2 h-full flex items-center justify-center p-6">
      <div
        class="w-full max-w-md bg-white rounded-3xl p-8 shadow-sm border border-sand-200 flex flex-col items-center"
      >
        <template v-if="!oobCode || !!invalidCodeMessage">
          <h1 class="mb-1 text-center text-3xl font-bold text-navy-500 tracking-tight">SunBeach Hotel</h1>
          <p class="mb-8 text-center text-sm text-coral-500" role="alert">
            {{ invalidCodeMessage || "Ce lien de réinitialisation est invalide. Merci d'en redemander un nouveau." }}
          </p>
          <RouterLink to="/password" class="block w-full">
            <BaseButton type="button" class="w-full">Redemander un lien</BaseButton>
          </RouterLink>
        </template>

        <template v-else-if="success">
          <h1 class="mb-1 text-center text-3xl font-bold text-navy-500 tracking-tight">SunBeach Hotel</h1>
          <p class="mb-8 text-center text-sm text-navy-300" role="status">
            Votre mot de passe a été modifié avec succès.
          </p>
          <RouterLink to="/login" class="block w-full">
            <BaseButton type="button" class="w-full">Se connecter</BaseButton>
          </RouterLink>
        </template>

        <template v-else>
          <h1 class="mb-1 text-center text-3xl font-bold text-navy-500 tracking-tight">SunBeach Hotel</h1>
          <p class="mb-8 text-center text-sm text-navy-300">
            Nouveau mot de passe pour <span class="font-semibold">{{ accountEmail }}</span>
          </p>

          <form class="w-full space-y-5" @submit.prevent="handleSubmit">
            <FormField
              v-model="newPassword"
              type="password"
              label="Nouveau mot de passe"
              placeholder="···········"
              required
              :invalid="!!errorMessage"
            />
            <FormField
              v-model="confirmPassword"
              type="password"
              label="Confirmez le nouveau mot de passe"
              placeholder="···········"
              required
              :invalid="!!errorMessage"
              :error="errorMessage"
            />

            <BaseButton type="submit" class="w-full" :loading="loading">Modifier</BaseButton>

            <div class="text-center">
              <RouterLink
                to="/login"
                class="text-xs font-medium text-navy-300 hover:text-navy-500 hover:underline transition-colors duration-150 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2"
              >
                Retour à la page de connexion
              </RouterLink>
            </div>
          </form>
        </template>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth'
import { auth } from '@/firebase'
import Img from '@/assets/img/pe.webp'
import BaseButton from '@/components/ui/BaseButton.vue'
import FormField from '@/components/ui/FormField.vue'

const route = useRoute()

const oobCode = ref<string | null>(null)
const accountEmail = ref('')
const invalidCodeMessage = ref('')

const newPassword = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const success = ref(false)
const errorMessage = ref('')

onMounted(async () => {
  const code = route.query.oobCode
  if (typeof code !== 'string' || !code) {
    oobCode.value = null
    return
  }
  try {
    accountEmail.value = await verifyPasswordResetCode(auth, code)
    oobCode.value = code
  } catch {
    invalidCodeMessage.value = 'Ce lien de réinitialisation a expiré ou a déjà été utilisé.'
  }
})

const handleSubmit = async () => {
  errorMessage.value = ''

  if (newPassword.value.length < 6) {
    errorMessage.value = 'Le mot de passe doit contenir au moins 6 caractères'
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = 'Les mots de passe ne correspondent pas'
    return
  }

  loading.value = true
  try {
    await confirmPasswordReset(auth, oobCode.value as string, newPassword.value)
    success.value = true
  } catch {
    invalidCodeMessage.value = 'Ce lien de réinitialisation a expiré ou a déjà été utilisé.'
  } finally {
    loading.value = false
  }
}
</script>
