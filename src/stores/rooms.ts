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
import type { Room } from '@/data/rooms'
import { rooms as seedRooms } from '@/data/rooms'
import { db } from '@/firebase'

export const useRoomsStore = defineStore('rooms', () => {
  const rooms = ref<Room[]>([])
  const loading = ref(false)
  const roomsCollection = collection(db, 'rooms')

  async function fetchRooms() {
    if (loading.value) return
    loading.value = true
    try {
      const snapshot = await getDocs(roomsCollection)
      if (snapshot.empty) {
        rooms.value = seedRooms.map((r) => ({ ...r }))
      } else {
        rooms.value = snapshot.docs.map((firestoreDoc, idx) => {
          const data = firestoreDoc.data() as Room & { id?: number }
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

  const availableRooms = computed(() => rooms.value.filter((room) => room.statut === 'Disponible'))
  const occupiedCount = computed(() => rooms.value.filter((room) => room.statut === 'Complet').length)
  const totalCount = computed(() => rooms.value.length)



  async function add(data: Omit<Room, 'id' | 'docId'>) {
    const newDoc = await addDoc(roomsCollection, { ...data })
    rooms.value.push({ ...(data as Room), docId: newDoc.id })
  }

  async function update(idOrDocId: number | string, patch: Partial<Room>) {
    const room = typeof idOrDocId === 'string'
      ? rooms.value.find((item) => item.docId === (idOrDocId as string))
      : rooms.value.find((item) => item.id === idOrDocId)
    const docId = room?.docId
    if (docId) {
      await updateDoc(doc(db, 'rooms', docId), patch)
    } else {
      if (typeof idOrDocId === 'string') {
        await updateDoc(doc(db, 'rooms', idOrDocId as string), patch)
      } else {
        const q = query(roomsCollection, where('id', '==', idOrDocId))
        const snapshot = await getDocs(q)
        if (!snapshot.empty) {
          await updateDoc(doc(db, 'rooms', snapshot.docs[0].id), patch)
        }
      }
    }
    if (room) Object.assign(room, patch)
  }

  async function remove(idOrDocId: number | string) {
    const index = typeof idOrDocId === 'string'
      ? rooms.value.findIndex((item) => item.docId === (idOrDocId as string))
      : rooms.value.findIndex((item) => item.id === idOrDocId)
    if (index === -1) return
    const room = rooms.value[index]
    const docId = room?.docId
    if (docId) {
      await deleteDoc(doc(db, 'rooms', docId))
    } else {
      if (typeof idOrDocId === 'string') {
        await deleteDoc(doc(db, 'rooms', idOrDocId as string))
      } else {
        const q = query(roomsCollection, where('id', '==', idOrDocId))
        const snapshot = await getDocs(q)
        if (!snapshot.empty) {
          await deleteDoc(doc(db, 'rooms', snapshot.docs[0].id))
        }
      }
    }
    rooms.value.splice(index, 1)
  }

  fetchRooms()

  function getById(idOrDocId: number | string) {
    if (typeof idOrDocId === 'string') return rooms.value.find((r) => r.docId === idOrDocId)
    return rooms.value.find((room) => room.id === idOrDocId)
  }

  return { rooms, availableRooms, occupiedCount, totalCount, getById, add, update, remove, fetchRooms }
})
