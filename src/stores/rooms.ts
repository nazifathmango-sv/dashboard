import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { rooms as seedRooms, type Room } from '@/data/rooms'

export const useRoomsStore = defineStore('rooms', () => {
  const rooms = ref<Room[]>(seedRooms.map((room) => ({ ...room })))

  const availableRooms = computed(() => rooms.value.filter((room) => room.statut === 'Disponible'))
  const occupiedCount = computed(() => rooms.value.filter((room) => room.statut === 'Complet').length)
  const totalCount = computed(() => rooms.value.length)

  function getById(id: number) {
    return rooms.value.find((room) => room.id === id)
  }

  function add(data: Omit<Room, 'id'>) {
    const nextId = Math.max(0, ...rooms.value.map((room) => room.id)) + 1
    rooms.value.push({ ...data, id: nextId })
  }

  function update(id: number, patch: Partial<Room>) {
    const index = rooms.value.findIndex((room) => room.id === id)
    if (index !== -1) {
      rooms.value[index] = { ...rooms.value[index], ...patch }
    }
  }

  function remove(id: number) {
    const index = rooms.value.findIndex((room) => room.id === id)
    if (index !== -1) {
      rooms.value.splice(index, 1)
    }
  }

  return { rooms, availableRooms, occupiedCount, totalCount, getById, add, update, remove }
})
