<template>
  <div class="flex h-screen w-screen overflow-hidden bg-gray-50">

    <div class="hidden w-1/2 h-full bg-[#0f4c9c] md:flex items-center justify-center">
      <img :src="Img" alt="mango" class="w-full h-full object-cover" />
    </div>


    <div class="w-full md:w-1/2 h-full flex items-center justify-center p-6">

      <div
        class="w-full max-w-md bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col items-center"
      >

        <div class="mb-8 text-center text-4xl font-bold">
          SunBeach Hotel
        </div>



        <form
          @submit.prevent="handleLogin"
          class="w-full space-y-5"
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
            placeholder="..........."
          />



          <div class="text-center">

            <RouterLink to="/password">

              <button
                type="button"
                class="text-xs text-gray-600 hover:underline font-medium cursor-pointer"
              >
                Mot de passe oublié ?
              </button>

            </RouterLink>

          </div>




          <BaseButton
            type="submit"
            class="w-full"
          >

            Connexion

          </BaseButton>



          <p
            v-if="errorMessage"
            class="text-red-500 text-sm text-center"
          >

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


import Img from '@/assets/img/pe.webp'
import BaseButton from '@/components/ui/BaseButton.vue'
import FormField from '@/components/ui/FormField.vue'



const email = ref('')
const password = ref('')
const errorMessage = ref('')


const router = useRouter()



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




      // Nettoyage ancien utilisateur
      localStorage.removeItem("role")



      // Enregistrement nouveau rôle
      localStorage.setItem(

        "role",

        userData.role

      )




      console.log(

        "Rôle enregistré :",

        localStorage.getItem("role")

      )




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
