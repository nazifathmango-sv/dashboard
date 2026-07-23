<template>
  <div class="flex h-screen w-screen overflow-hidden bg-gray-50">

    <div class="hidden md:flex w-1/2 h-full bg-[#0f4c9c] items-center justify-center">
      <img
        :src="Img"
        alt="SunBeach Hotel"
        class="w-full h-full object-cover"
      />
    </div>


    <div class="w-full md:w-1/2 h-full flex items-center justify-center p-6">

      <div
        class="w-full max-w-md bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
      >

        <h1 class="text-4xl font-bold text-center mb-2">
          SunBeach Hotel
        </h1>

        <p class="text-center text-gray-500 mb-8">
          Connexion à votre espace
        </p>


        <form
          @submit.prevent="seConnecter"
          class="space-y-5"
        >

          <FormField
            v-model="email"
            type="email"
            label="Adresse email"
            placeholder="exemple@gmail.com"
          />


          <FormField
            v-model="password"
            type="password"
            label="Mot de passe"
            placeholder="********"
          />


          <p
            v-if="messageErreur"
            class="text-red-500 text-sm text-center"
          >
            {{ messageErreur }}
          </p>


          <div class="text-center">
            <RouterLink
              to="/password"
              class="text-xs text-gray-600 hover:underline font-medium"
            >
              Mot de passe oublié ?
            </RouterLink>
          </div>


          <BaseButton
            type="submit"
            class="w-full"
          >
            Connexion
          </BaseButton>


        </form>

      </div>

    </div>

  </div>
</template>


<script setup lang="ts">

import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

import { auth, db } from '@/firebase'

import Img from '@/assets/img/pe.webp'
import BaseButton from '@/components/ui/BaseButton.vue'
import FormField from '@/components/ui/FormField.vue'


const router = useRouter()


const email = ref('')
const password = ref('')

const messageErreur = ref('')



const seConnecter = async () => {

  try {

    messageErreur.value = ''


    const userCredential = await signInWithEmailAndPassword(
      auth,
      email.value.trim(),
      password.value
    )


    const uid = userCredential.user.uid


    const utilisateur = await getDoc(
      doc(db, 'utilisateurs', uid)
    )


    if (!utilisateur.exists()) {

      messageErreur.value =
        "Aucun profil utilisateur trouvé."

      return
    }


    const role = utilisateur
      .data()
      .role
      .trim()
      .toLowerCase()


    console.log("Rôle connecté :", role)


    localStorage.setItem(
      'roleUtilisateur',
      role
    )


    if (
      role === 'administrateur' ||
      role === 'receptionniste'
    ) {

      await router.push('/charts')

    } else {

      messageErreur.value =
        "Ce compte n'a pas l'autorisation d'accès."

    }


  } catch (erreur) {

    console.error(
      "Erreur connexion :",
      erreur
    )


    messageErreur.value =
      "Email ou mot de passe incorrect."

  }

}

</script>
