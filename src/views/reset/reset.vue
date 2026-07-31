```vue
<template>
  <div
    class="min-h-screen bg-sand-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden"
  >
    <!-- Décor d'arrière-plan -->
    <div
      class="absolute -top-32 -left-32 w-80 h-80 bg-gold-400/10 rounded-full blur-3xl"
    ></div>

    <div
      class="absolute -bottom-40 -right-32 w-96 h-96 bg-navy-500/10 rounded-full blur-3xl"
    ></div>

    <!-- Carte principale -->
    <div
      class="relative w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-sand-200"
    >
      <div class="grid grid-cols-1 lg:grid-cols-2 min-h-[620px]">

        <!-- ========================= -->
        <!-- PANNEAU GAUCHE -->
        <!-- ========================= -->
        <div
          class="relative hidden lg:flex flex-col justify-between bg-navy-500 p-10 xl:p-12 overflow-hidden"
        >
          <!-- Décor -->
          <div
            class="absolute -top-24 -right-24 w-72 h-72 rounded-full border border-white/10"
          ></div>

          <div
            class="absolute -bottom-32 -left-24 w-80 h-80 rounded-full border border-white/10"
          ></div>

          <div
            class="absolute top-1/2 right-10 w-32 h-32 rounded-full bg-gold-400/10 blur-2xl"
          ></div>

          <!-- Logo / identité -->
          <div class="relative z-10">
            <div class="flex items-center gap-3 mb-10">
              <div
                class="w-12 h-12 rounded-2xl bg-gold-400 flex items-center justify-center shadow-lg"
              >
                <Icon name="lock" class="w-6 h-6 text-navy-500" />
              </div>

              <div>
                <p class="text-white font-bold text-xl tracking-wide">
                  SunBeach
                </p>
                <p class="text-gold-300 text-xs uppercase tracking-[0.25em]">
                  Hotel
                </p>
              </div>
            </div>

            <div class="max-w-sm">
              <p
                class="text-gold-300 text-xs font-semibold uppercase tracking-[0.2em] mb-4"
              >
                Sécurité du compte
              </p>

              <h2
                class="text-4xl xl:text-5xl font-bold text-white leading-tight"
              >
                Un nouveau départ,
                <span class="text-gold-300">en toute sécurité.</span>
              </h2>

              <p class="mt-6 text-white/65 leading-relaxed text-sm">
                Créez un nouveau mot de passe sécurisé pour retrouver
                l'accès à votre espace SunBeach Hotel.
              </p>
            </div>
          </div>

          <!-- Bas du panneau -->
          <div class="relative z-10">
            <div class="flex items-center gap-3 text-white/50 text-xs">
              <div class="w-8 h-px bg-gold-400/60"></div>
              <span>Votre confort, notre priorité</span>
            </div>
          </div>
        </div>

        <!-- ========================= -->
        <!-- PANNEAU DROIT -->
        <!-- ========================= -->
        <div
          class="flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-12 xl:px-16"
        >

          <!-- Version mobile -->
          <div class="lg:hidden text-center mb-8">
            <div
              class="mx-auto w-14 h-14 rounded-2xl bg-navy-500 flex items-center justify-center shadow-lg mb-4"
            >
              <Icon name="lock" class="w-6 h-6 text-gold-400" />
            </div>

            <p class="text-lg font-bold text-navy-500">
              SunBeach Hotel
            </p>

            <p
              class="text-[10px] text-gold-500 uppercase tracking-[0.25em] font-semibold mt-1"
            >
              Votre espace sécurisé
            </p>
          </div>

          <!-- ========================= -->
          <!-- FORMULAIRE -->
          <!-- ========================= -->
          <div v-if="!success" class="w-full max-w-md mx-auto">

            <div class="mb-8">
              <div
                class="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gold-400/15 text-gold-500 mb-5"
              >
                <Icon name="lock" class="w-5 h-5" />
              </div>

              <p
                class="text-xs font-semibold uppercase tracking-[0.18em] text-gold-500 mb-2"
              >
                Réinitialisation
              </p>

              <h1 class="text-3xl font-bold text-navy-500">
                Créez votre mot de passe
              </h1>

              <p class="mt-3 text-sm text-navy-300 leading-relaxed">
                Choisissez un mot de passe sécurisé pour protéger votre compte.
              </p>
            </div>

            <form
              @submit.prevent="resetPassword"
              class="space-y-5"
            >
              <FormField
                v-model="password"
                type="password"
                label="Nouveau mot de passe"
                placeholder="Entrez votre mot de passe"
                :invalid="!!error"
              />

              <FormField
                v-model="confirmPassword"
                type="password"
                label="Confirmer le mot de passe"
                placeholder="Confirmez votre mot de passe"
                :invalid="!!error"
              />

              <!-- Indication sécurité -->
              <div
                class="flex items-start gap-3 rounded-xl bg-sand-50 border border-sand-200 px-4 py-3"
              >
                <Icon
                  name="shield-check"
                  class="w-4 h-4 text-gold-500 mt-0.5 shrink-0"
                />

                <p class="text-xs text-navy-300 leading-relaxed">
                  Utilisez au moins 6 caractères et évitez les mots de passe
                  faciles à deviner.
                </p>
              </div>

              <!-- Erreur -->
              <div
                v-if="error"
                class="flex items-start gap-3 rounded-xl border border-coral-200 bg-coral-50 px-4 py-3"
              >
                <Icon
                  name="x-mark"
                  class="w-4 h-4 text-coral-500 mt-0.5 shrink-0"
                />

                <p class="text-sm text-coral-500 leading-relaxed">
                  {{ error }}
                </p>
              </div>

              <BaseButton
                type="submit"
                class="w-full"
                :loading="loading"
              >
                <span>Créer mon mot de passe</span>
              </BaseButton>
            </form>

            <p class="mt-8 text-center text-xs text-navy-200">
              SunBeach Hotel · Espace sécurisé
            </p>
          </div>

          <!-- ========================= -->
          <!-- SUCCÈS -->
          <!-- ========================= -->
          <div
            v-else
            class="w-full max-w-md mx-auto text-center"
          >
            <div
              class="mx-auto w-20 h-20 rounded-3xl bg-green-50 border border-green-100 flex items-center justify-center mb-6"
            >
              <div
                class="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center shadow-lg"
              >
                <Icon
                  name="check"
                  class="w-6 h-6 text-white"
                />
              </div>
            </div>

            <p
              class="text-xs font-semibold uppercase tracking-[0.18em] text-gold-500 mb-3"
            >
              Tout est prêt
            </p>

            <h2 class="text-3xl font-bold text-navy-500">
              Mot de passe créé !
            </h2>

            <p
              class="mt-4 text-sm text-navy-300 leading-relaxed max-w-sm mx-auto"
            >
              Votre mot de passe a été créé avec succès.
              Vous pouvez maintenant accéder à votre espace SunBeach Hotel.
            </p>

            <BaseButton
              class="w-full mt-8"
              @click="goToLogin"
            >
              Se connecter
            </BaseButton>

            <p class="mt-6 text-xs text-navy-200">
              Bienvenue chez SunBeach Hotel
            </p>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  confirmPasswordReset,
  verifyPasswordResetCode,
} from 'firebase/auth'

import { auth } from '@/firebase'
import BaseButton from '@/components/ui/BaseButton.vue'
import FormField from '@/components/ui/FormField.vue'
import Icon from '@/components/ui/Icon.vue'

const route = useRoute()
const router = useRouter()

const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)         // Pour le bouton d'envoi du formulaire
const isVerifying = ref(true)      // Indique si le lien est en cours de validation par Firebase
const isCodeValid = ref(false)     // Détermine si le formulaire de saisie doit s'afficher
const email = ref('')              // Stocke l'email de l'utilisateur à afficher à l'écran
const error = ref('')
const success = ref(false)

// Paramètres envoyés par Firebase Authentication
const mode = route.query.mode as string | undefined
const oobCode = route.query.oobCode as string | undefined

/**
 * Validation du lien dès le chargement de la page
 */
onMounted(async () => {
  console.log('[ResetPassword] mode :', mode)
  console.log('[ResetPassword] oobCode présent :', !!oobCode)

  if (!oobCode || mode !== 'resetPassword') {
    error.value = 'Le lien de réinitialisation est invalide ou incomplet.'
    isVerifying.value = false
    return
  }

  try {
    // Vérifie la validité du jeton auprès de Firebase et récupère l'email lié
    email.value = await verifyPasswordResetCode(auth, oobCode)
    isCodeValid.value = true
  } catch (err: any) {
    console.error('[ResetPassword] Erreur validation lien :', err)

    // On affiche l'erreur directement au chargement de la page
    switch (err.code) {
      case 'auth/expired-action-code':
        error.value = 'Ce lien a expiré. Demandez un nouveau lien de réinitialisation.'
        break
      case 'auth/invalid-action-code':
        error.value = 'Ce lien est invalide ou a déjà été utilisé.'
        break
      case 'auth/user-disabled':
        error.value = 'Ce compte a été désactivé.'
        break
      case 'auth/user-not-found':
        error.value = 'Aucun compte associé à ce lien.'
        break
      default:
        error.value = 'Impossible de vérifier le lien de réinitialisation.'
    }
  } finally {
    isVerifying.value = false
  }
})
async function resetPassword() {
  error.value = ''

  if (!isCodeValid.value || !oobCode) {
    error.value = 'Action impossible. Le lien de réinitialisation est invalide.'
    return
  }

  if (password.value.length < 6) {
    error.value = 'Le mot de passe doit contenir au moins 6 caractères.'
    return
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'Les deux mots de passe ne correspondent pas.'
    return
  }

  loading.value = true

  try {
    await confirmPasswordReset(
      auth,
      oobCode,
      password.value,
    )

    success.value = true
    console.log('[ResetPassword] Mot de passe créé avec succès')
  } catch (err: any) {
    console.error('[ResetPassword] Erreur soumission :', err)

    switch (err.code) {
      case 'auth/weak-password':
        error.value = 'Le mot de passe choisi est trop faible.'
        break
      default:
        error.value = 'Impossible de mettre à jour le mot de passe. Veuillez réessayer.'
    }
  } finally {
    loading.value = false
  }
}

function goToLogin() {
  router.push('/login')
}
</script>

