import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  doc,
} from 'firebase/firestore'
import type { Reservation, StayStatus } from '@/data/reservations'
import { reservations as seedReservations } from '@/data/reservations'
import { db } from '@/firebase'

export const useReservationsStore = defineStore('reservations', () => {
  const reservations = ref<Reservation[]>([])
  const loading = ref(false)
  const reservationsCollection = collection(db, 'reservations')

  async function fetchReservations() {
    if (loading.value) return
    loading.value = true
    try {
      const snapshot = await getDocs(reservationsCollection)
      if (snapshot.empty) {
        reservations.value = seedReservations.map((r) => ({ ...r }))
      } else {
        reservations.value = snapshot.docs.map((firestoreDoc, idx) => {
          const data = firestoreDoc.data() as Reservation & { id?: number }
          return {
            ...data,
            id: data.id ?? idx + 1,
            docId: firestoreDoc.id,
          }
        })
      }
    } finally {
      loading.value = false
    }
  }

  const arrivalsToday = computed(() => {
    const today = new Date().toISOString().slice(0, 10)
    return reservations.value.filter((reservation) => reservation.dateDebut === today).length
  })

  function getById(idOrDocId: number | string) {
    if (typeof idOrDocId === 'string') return reservations.value.find((r) => r.docId === idOrDocId)
    return reservations.value.find((reservation) => reservation.id === idOrDocId)
  }

  function reservationsForRoom(roomId: number) {
    return reservations.value.filter((reservation) => reservation.roomId === roomId)
  }

  function occupancyForDate(roomId: number, dateISO: string) {
    return reservations.value.find(
      (reservation) => reservation.roomId === roomId && dateISO >= reservation.dateDebut && dateISO < reservation.dateFin,
    )
  }

  async function add(data: Omit<Reservation, 'id' | 'stayStatus' | 'docId'>) {
    const newDoc = await addDoc(reservationsCollection, { ...data, stayStatus: 'À venir' })
    reservations.value.push({ ...(data as Reservation), stayStatus: 'À venir', docId: newDoc.id })
  }

  async function update(idOrDocId: number | string, patch: Partial<Reservation>) {
    const reservation = typeof idOrDocId === 'string'
      ? reservations.value.find((item) => item.docId === idOrDocId)
      : reservations.value.find((item) => item.id === idOrDocId)
    const docId = reservation?.docId

    if (docId) {
      await updateDoc(doc(db, 'reservations', docId), patch)
    } else {
      if (typeof idOrDocId === 'string') {
        await updateDoc(doc(db, 'reservations', idOrDocId), patch)
      } else {
        const q = query(reservationsCollection, where('id', '==', idOrDocId))
        const snapshot = await getDocs(q)
        const found = snapshot.docs[0]
        if (found) {
          await updateDoc(doc(db, 'reservations', found.id), patch)
        }
      }
    }
    if (reservation) Object.assign(reservation, patch)
  }

  async function remove(idOrDocId: number | string) {
    const index = typeof idOrDocId === 'string'
      ? reservations.value.findIndex((item) => item.docId === idOrDocId)
      : reservations.value.findIndex((item) => item.id === idOrDocId)
    if (index === -1) return
    const reservation = reservations.value[index]
    const docId = reservation?.docId
    if (docId) {
      await deleteDoc(doc(db, 'reservations', docId))
    } else {
      if (typeof idOrDocId === 'string') {
        await deleteDoc(doc(db, 'reservations', idOrDocId))
      } else {
        const q = query(reservationsCollection, where('id', '==', idOrDocId))
        const snapshot = await getDocs(q)
        const found = snapshot.docs[0]
        if (found) {
          await deleteDoc(doc(db, 'reservations', found.id))
        }
      }
    }
    reservations.value.splice(index, 1)
  }

  function setStayStatus(idOrDocId: number | string, status: StayStatus) {
    update(idOrDocId, { stayStatus: status })
  }

  fetchReservations()

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
    fetchReservations,
  }
})
