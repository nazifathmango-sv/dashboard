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
import type { Client } from '@/data/clients'
import { clients as seedClients } from '@/data/clients'
import { db } from '@/firebase'

export const useClientsStore = defineStore('clients', () => {
  const clients = ref<Client[]>([])
  const loading = ref(false)
  const clientsCollection = collection(db, 'clients')

  async function fetchClients() {
    if (loading.value) return
    loading.value = true
    try {
      const snapshot = await getDocs(clientsCollection)
      if (snapshot.empty) {
        clients.value = seedClients.map((c) => ({ ...c }))
      } else {
        clients.value = snapshot.docs.map((firestoreDoc, idx) => {
          const data = firestoreDoc.data() as Client & { id?: number }
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

  async function add(data: Omit<Client, 'id' | 'docId'>) {
    const newDoc = await addDoc(clientsCollection, { ...data })
    clients.value.push({ ...(data as Client), docId: newDoc.id })
  }

  async function update(idOrDocId: number | string, patch: Partial<Client>) {
    const client = typeof idOrDocId === 'string'
      ? clients.value.find((item) => item.docId === idOrDocId)
      : clients.value.find((item) => item.id === idOrDocId)
    let targetDocId = client?.docId

    if (targetDocId) {
      await updateDoc(doc(db, 'clients', targetDocId), patch)
    } else {
      if (typeof idOrDocId === 'string') {
        // try updating directly by docId
        await updateDoc(doc(db, 'clients', idOrDocId), patch)
      } else {
        const q = query(clientsCollection, where('id', '==', idOrDocId))
        const snapshot = await getDocs(q)
        const found = snapshot.docs[0]
        if (found) {
          await updateDoc(doc(db, 'clients', found.id), patch)
        }
      }
    }
    if (client) Object.assign(client, patch)
  }

  async function remove(idOrDocId: number | string) {
    const index = typeof idOrDocId === 'string'
      ? clients.value.findIndex((item) => item.docId === idOrDocId)
      : clients.value.findIndex((item) => item.id === idOrDocId)
    if (index === -1) return
    const client = clients.value[index]
    const docId = client?.docId
    if (docId) {
      await deleteDoc(doc(db, 'clients', docId))
    } else {
      if (typeof idOrDocId === 'string') {
        await deleteDoc(doc(db, 'clients', idOrDocId))
      } else {
        const q = query(clientsCollection, where('id', '==', idOrDocId))
        const snapshot = await getDocs(q)
        const found = snapshot.docs[0]
        if (found) {
          await deleteDoc(doc(db, 'clients', found.id))
        }
      }
    }
    clients.value.splice(index, 1)
  }

  function getById(idOrDocId: number | string) {
    if (typeof idOrDocId === 'string') return clients.value.find((c) => c.docId === idOrDocId)
    return clients.value.find((client) => client.id === idOrDocId)
  }

  fetchClients()

  return { clients, loading, getById, add, update, remove, fetchClients }
})
