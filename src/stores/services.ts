import { ref } from 'vue'
import { defineStore } from 'pinia'
import { collection, getDocs } from 'firebase/firestore'
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

  fetchServices()

  return {
    services,
    loading,
    fetchServices,
  }
})
