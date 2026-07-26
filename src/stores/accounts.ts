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
import type { Account } from '@/data/accounts'
import { accounts as seedAccounts } from '@/data/accounts'
import { db } from '@/firebase'

export const useAccountsStore = defineStore('accounts', () => {
  const accounts = ref<Account[]>([])
  const loading = ref(false)
  const accountsCollection = collection(db, 'accounts')

  async function fetchAccounts() {
    if (loading.value) return
    loading.value = true
    try {
      const snapshot = await getDocs(accountsCollection)
      if (snapshot.empty) {
        accounts.value = seedAccounts.map((a) => ({ ...a }))
      } else {
        accounts.value = snapshot.docs.map((firestoreDoc, idx) => {
          const data = firestoreDoc.data() as Account & { id?: number }
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
    if (typeof idOrDocId === 'string') return accounts.value.find((a) => a.docId === idOrDocId)
    return accounts.value.find((account) => account.id === idOrDocId)
  }

  async function add(data: Omit<Account, 'id' | 'docId'>) {
    const newDoc = await addDoc(accountsCollection, { ...data })
    accounts.value.push({ ...(data as Account), docId: newDoc.id })
  }

  async function update(idOrDocId: number | string, patch: Partial<Account>) {
    const account = typeof idOrDocId === 'string'
      ? accounts.value.find((item) => item.docId === (idOrDocId as string))
      : accounts.value.find((item) => item.id === idOrDocId)
    const docId = account?.docId
    if (docId) {
      await updateDoc(doc(db, 'accounts', docId), patch)
    } else {
      if (typeof idOrDocId === 'string') {
        await updateDoc(doc(db, 'accounts', idOrDocId as string), patch)
      } else {
        const q = query(accountsCollection, where('id', '==', idOrDocId))
        const snapshot = await getDocs(q)
        if (!snapshot.empty) {
          await updateDoc(doc(db, 'accounts', snapshot.docs[0].id), patch)
        }
      }
    }
    if (account) Object.assign(account, patch)
  }

  async function remove(idOrDocId: number | string) {
    const index = typeof idOrDocId === 'string'
      ? accounts.value.findIndex((item) => item.docId === (idOrDocId as string))
      : accounts.value.findIndex((item) => item.id === idOrDocId)
    if (index === -1) return
    const account = accounts.value[index]
    const docId = account?.docId
    if (docId) {
      await deleteDoc(doc(db, 'accounts', docId))
    } else {
      if (typeof idOrDocId === 'string') {
        await deleteDoc(doc(db, 'accounts', idOrDocId as string))
      } else {
        const q = query(accountsCollection, where('id', '==', idOrDocId))
        const snapshot = await getDocs(q)
        if (!snapshot.empty) {
          await deleteDoc(doc(db, 'accounts', snapshot.docs[0].id))
        }
      }
    }
    accounts.value.splice(index, 1)
  }

  fetchAccounts()

  return { accounts, loading, getById, add, update, remove, fetchAccounts }
})
