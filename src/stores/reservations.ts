import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { reservations as seedReservations, type Reservation, type StayStatus } from '@/data/reservations'

export const useReservationsStore = defineStore('reservations', () => {
  const reservations = ref<Reservation[]>(seedReservations.map((reservation) => ({ ...reservation })))

  const arrivalsToday = computed(() => {
    const today = new Date().toISOString().slice(0, 10)
    return reservations.value.filter((reservation) => reservation.dateDebut === today).length
  })

  function getById(id: number) {
    return reservations.value.find((reservation) => reservation.id === id)
  }

  function reservationsForRoom(roomId: number) {
    return reservations.value.filter((reservation) => reservation.roomId === roomId)
  }

  function occupancyForDate(roomId: number, dateISO: string) {
    return reservations.value.find(
      (reservation) => reservation.roomId === roomId && dateISO >= reservation.dateDebut && dateISO < reservation.dateFin,
    )
  }

  function add(data: Omit<Reservation, 'id' | 'stayStatus'>) {
    const nextId = Math.max(0, ...reservations.value.map((reservation) => reservation.id)) + 1
    reservations.value.push({ ...data, id: nextId, stayStatus: 'À venir' })
  }

  function update(id: number, patch: Partial<Reservation>) {
    const index = reservations.value.findIndex((reservation) => reservation.id === id)
    if (index !== -1) {
      reservations.value[index] = { ...reservations.value[index], ...patch }
    }
  }

  function remove(id: number) {
    const index = reservations.value.findIndex((reservation) => reservation.id === id)
    if (index !== -1) {
      reservations.value.splice(index, 1)
    }
  }

  function setStayStatus(id: number, status: StayStatus) {
    update(id, { stayStatus: status })
  }

  return {
    reservations,
    arrivalsToday,
    getById,
    reservationsForRoom,
    occupancyForDate,
    add,
    update,
    remove,
    setStayStatus,
  }
})
