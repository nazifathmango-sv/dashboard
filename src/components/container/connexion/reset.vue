<template>
  <div class="flex h-screen overflow-hidden bg-gray-50">
    <div class="w-full h-full flex items-center justify-center p-6">
      <div
        class="w-full max-w-md bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col items-center"
      >
        <div class="mb-12 text-center text-4xl font-bold">SunBeach Hotel</div>
        <div class="w-full m-2 space-y-5">
          <div>
            <div class="text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</div>
            <input
              type="password"
              placeholder=".........."
              class="w-full px-4 py-2 bg-gray-50 border border-gray-400 rounded-lg text-sm focus:outline-none focus:border-gray-400"
            />
          </div>
          <div class="text-sm font-medium text-gray-700 mb-1">Confirmez le nouveau mot de passe</div>
            <input
              type="password"
              placeholder=".........."
              class="w-full px-4 py-2 bg-gray-50 border border-gray-400 rounded-lg text-sm focus:outline-none focus:border-gray-400"
            />
          </div>
          <button
            type="submit"
            class="w-full py-3 bg-gray-800 text-white font-medium rounded-full transition duration-200 shadow-md text-sm hover:bg-gray-400 hover:text-black border border-transparent hover:border-gray-400 cursor-pointer"
          >
            Modifier
          </button>
          <div class="text-center">
            <RouterLink to="/">
              <button class="text-xs text-gray-600 hover:underline font-medium cursor-pointer hover:scale-105 active:scale-95 ">
                  Retour à la page de connexion
              </button>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
</template>
<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
