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
        <p class="mb-8 text-center text-sm text-navy-300">Connectez-vous à votre espace d'administration.</p>

        <form @submit.prevent="handleLogin" class="w-full space-y-5">
          <FormField v-model="email" type="email" label="Adresse email" placeholder="exemple@gmail.com" required />

          <FormField v-model="password" type="password" label="Mot de passe" placeholder="···········" required />

          <div class="text-center">
            <RouterLink
              to="/password"
              class="text-xs font-medium text-navy-300 hover:text-navy-500 hover:underline transition-colors duration-150 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2"
            >
              Mot de passe oublié ?
            </RouterLink>
          </div>

          <BaseButton type="submit" class="w-full">Connexion</BaseButton>

          <p v-if="errorMessage" class="text-sm text-center text-coral-500" role="alert">
            {{ errorMessage }}
          </p>
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
import { useAuthStore } from '@/stores/auth'


import Img from '@/assets/img/pe.webp'
import BaseButton from '@/components/ui/BaseButton.vue'
import FormField from '@/components/ui/FormField.vue'



const email = ref('')
const password = ref('')
const errorMessage = ref('')


const router = useRouter()
const authStore = useAuthStore()



const handleLogin = async () => {


  errorMessage.value = ''



  try {

    const userCredential = await signInWithEmailAndPassword(

      auth,

      email.value.trim(),

      password.value

    )



    const uid = userCredential.user.uid



    console.log(
      "Utilisateur connecté UID :",
      uid
    )



    // Recherche du profil dans Firestore
    const userDoc = await getDoc(

      doc(
        db,
        "utilisateur",
        uid
      )

    )




    if(userDoc.exists()) {



      const userData = userDoc.data()



      console.log(
        "Données utilisateur :",
        userData
      )




      if(!userData.role){


        errorMessage.value =
        "Aucun rôle défini pour cet utilisateur"


        return

      }




      // Attendre que le store d'auth soit synchronisé avant de rediriger
      await authStore.waitUntilReady()

      // Redirection dashboard
      router.push('/charts')




    }

    else {



      console.log(
        "Aucun profil Firestore trouvé pour :",
        uid
      )



      errorMessage.value =
      "Aucun profil utilisateur trouvé"



    }




  }



  catch(error:any) {



    console.log(
      "Erreur Firebase :",
      error.code
    )



    if(error.code === "auth/user-not-found"){


      errorMessage.value =
      "Utilisateur inexistant"



    }



    else if(error.code === "auth/wrong-password"){


      errorMessage.value =
      "Mot de passe incorrect"



    }



    else if(error.code === "auth/invalid-credential"){


      errorMessage.value =
      "Email ou mot de passe incorrect"



    }



    else{


      errorMessage.value =
      "Erreur de connexion"



    }



  }


}



</script>
