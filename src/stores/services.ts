import { ref } from 'vue'
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
import type { Service } from '@/data/services'
import { services as seedServices } from '@/data/services'
import { db } from '@/firebase'

export const useServicesStore = defineStore('services', () => {
  const services = ref<Service[]>([...seedServices])
  const loading = ref(false)
  const servicesCollection = collection(db, 'services')

  async function fetchServices() {
    if (loading.value) return
    loading.value = true
    try {
      const snapshot = await getDocs(servicesCollection)
      if (!snapshot.empty) {
        services.value = snapshot.docs.map((firestoreDoc, idx) => {
          const data = firestoreDoc.data() as Service & { id?: number }
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

  function getById(idOrDocId: number | string) {
    if (typeof idOrDocId === 'string') return services.value.find((s) => s.docId === idOrDocId)
    return services.value.find((s) => s.id === idOrDocId)
  }

  async function add(data: Omit<Service, 'id' | 'docId'>) {
    const nextId = services.value.reduce((max, s) => Math.max(max, s.id), 0) + 1
    const newDoc = await addDoc(servicesCollection, { ...data, id: nextId })
    services.value.push({ ...(data as Service), id: nextId, docId: newDoc.id })
  }

  async function update(idOrDocId: number | string, patch: Partial<Service>) {
    const service = typeof idOrDocId === 'string'
      ? services.value.find((item) => item.docId === (idOrDocId as string))
      : services.value.find((item) => item.id === idOrDocId)
    const docId = service?.docId
    if (docId) {
      await updateDoc(doc(db, 'services', docId), patch)
    } else {
      if (typeof idOrDocId === 'string') {
        await updateDoc(doc(db, 'services', idOrDocId as string), patch)
      } else {
        const q = query(servicesCollection, where('id', '==', idOrDocId))
        const snapshot = await getDocs(q)
        const found = snapshot.docs[0]
        if (found) {
          await updateDoc(doc(db, 'services', found.id), patch)
        }
      }
    }
    if (service) Object.assign(service, patch)
  }

  async function remove(idOrDocId: number | string) {
    const index = typeof idOrDocId === 'string'
      ? services.value.findIndex((item) => item.docId === (idOrDocId as string))
      : services.value.findIndex((item) => item.id === idOrDocId)
    if (index === -1) return
    const service = services.value[index]
    const docId = service?.docId
    if (docId) {
      await deleteDoc(doc(db, 'services', docId))
    } else {
      if (typeof idOrDocId === 'string') {
        await deleteDoc(doc(db, 'services', idOrDocId as string))
      } else {
        const q = query(servicesCollection, where('id', '==', idOrDocId))
        const snapshot = await getDocs(q)
        const found = snapshot.docs[0]
        if (found) {
          await deleteDoc(doc(db, 'services', found.id))
        }
      }
    }
    services.value.splice(index, 1)
  }

  fetchServices()

  return {
    services,
    loading,
    fetchServices,
    getById,
    add,
    update,
    remove,
  }
})
