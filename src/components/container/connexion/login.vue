<template>
  <div class="flex h-screen w-screen overflow-hidden bg-gray-50">
    <div class="hidden w-1/2 h-full bg-[#0f4c9c] md:flex items-center justify-center">
      <img :src="Img" alt="mango" class="w-full h-full object-cover" />
    </div>
    <div class="w-full md:w-1/2 h-full flex items-center justify-center p-6">
      <div class="w-full max-w-md bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col items-center">
        <div class="mb-2 text-center text-4xl font-bold ">
          SunBeach Hotel
        </div>
        <div class="w-full m-8 space-y-5">
          <div>
            <div class=" text-5sm font-medium text-gray-700 mb-1">Adresse email</div>
            <input type="email" placeholder="exemple@gmail.com" class="w-full px-4 py-2 bg-gray-50 border border-gray-400 rounded-lg text-sm focus:outline-none focus:border-gray-400" />
          </div>
          <div>
            <div class=" text-5sm font-medium text-gray-700 mb-1">Mot de passe</div>
            <input type="password" placeholder="..........." class="w-full px-4 py-2 bg-gray-50 border border-gray-400 rounded-lg text-sm focus:outline-none focus:border-gray-400" />
          </div>
          <div class="text-center">
            <RouterLink to="/password">
              <button class="text-xs text-gray-600 hover:underline font-medium cursor-pointer">Mot de passe oublié ?</button>
            </RouterLink>
          </div>
          <RouterLink to="/charts" class="block w-full">
            <button type="submit" class="w-full py-3 bg-gray-800 text-white font-medium rounded-full text-sm shadow-md border border-transparent cursor-pointer transform transition duration-200 ease-in-out hover:bg-gray-400 hover:text-black hover:border-gray-400 hover:scale-105 active:scale-95">
              Connexion
            </button>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import Img from '@/assets/img/pe.webp'
</script>
