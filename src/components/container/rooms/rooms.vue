<template>
  <div class="bg-white rounded-xl shadow p-5">
    <h2 class="text-xl font-bold mb-5">Nos Chambres</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="room in rooms"
        :key="room.id"
        class="rounded-2xl shadow-md overflow-hidden border border-gray-100"
      >
        <img
          :src="room.image"
          :alt="room.titre"
          class="w-full h-48 object-cover"
        />
        <div class="p-5">
          <h3 class="text-xl font-bold text-gray-800 mb-2">
            {{ room.titre }}
          </h3>
          <p class="text-sm text-gray-500 mb-4">
            {{ room.description }}
          </p>

          <div class="grid grid-cols-3 gap-2 text-center">
            <div class="bg-amber-50 rounded-lg p-2">
              <p class="text-xs text-gray-500">Prix</p>
              <p class="text-sm font-semibold text-gray-800">{{ room.prix }}</p>
            </div>
            <div class="bg-amber-50 rounded-lg p-2">
              <p class="text-xs text-gray-500">Personnes</p>
              <p class="text-sm font-semibold text-gray-800">{{ room.personnes }}</p>
            </div>
            <div class="bg-amber-50 rounded-lg p-2">
              <p class="text-xs text-gray-500">Lit</p>
              <p class="text-sm font-semibold text-gray-800">{{ room.lit }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { rooms } from '@/data/rooms'
</script>
