import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  collection,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  doc,
} from 'firebase/firestore'
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signOut } from 'firebase/auth'
import type { Account } from '@/data/accounts'
import { accounts as seedAccounts } from '@/data/accounts'
import { db, secondaryAuth } from '@/firebase'

function generateTemporaryPassword(): string {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 16)
}

export const useAccountsStore = defineStore('accounts', () => {
  const accounts = ref<Account[]>([])
  const loading = ref(false)
  const accountsCollection = collection(db, 'utilisateur')

  async function fetchAccounts() {
    if (loading.value) return
    loading.value = true
    try {
      const snapshot = await getDocs(accountsCollection)
      if (snapshot.empty) {
        accounts.value = seedAccounts.map((a) => ({ ...a }))
      } else {
        accounts.value = snapshot.docs
          .map((firestoreDoc, idx): Account | null => {
            const data = firestoreDoc.data() as Partial<Account> & { id?: number }
            if (!data.name || !data.role) return null
            return {
              name: data.name,
              email: data.email ?? '',
              role: data.role,
              status: data.status ?? 'Actif',
              id: data.id ?? idx + 1,
              docId: firestoreDoc.id,
            }
          })
          .filter((account): account is Account => account !== null)
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
    const email = data.email.trim()
    const temporaryPassword = generateTemporaryPassword()

    // Créé via une instance Firebase secondaire pour ne pas remplacer la session
    // de l'administrateur actuellement connecté sur l'instance principale.
    const credential = await createUserWithEmailAndPassword(secondaryAuth, email, temporaryPassword)
    const uid = credential.user.uid

    try {
      await setDoc(doc(db, 'utilisateur', uid), { ...data, email })
      await sendPasswordResetEmail(secondaryAuth, email, {
        url: `${window.location.origin}/reset`,
        handleCodeInApp: true,
      })
    } catch (error) {
      console.error('[accountsStore.add] échec lors de la création du compte ou de l’envoi de l’email :', error)
      throw error
    } finally {
      await signOut(secondaryAuth)
    }

    accounts.value.push({ ...(data as Account), email, docId: uid })
  }

  async function update(idOrDocId: number | string, patch: Partial<Account>) {
    const account = typeof idOrDocId === 'string'
      ? accounts.value.find((item) => item.docId === (idOrDocId as string))
      : accounts.value.find((item) => item.id === idOrDocId)
    const docId = account?.docId
    if (docId) {
      await updateDoc(doc(db, 'utilisateur', docId), patch)
    } else {
      if (typeof idOrDocId === 'string') {
        await updateDoc(doc(db, 'utilisateur', idOrDocId as string), patch)
      } else {
        const q = query(accountsCollection, where('id', '==', idOrDocId))
        const snapshot = await getDocs(q)
        const firstDoc = snapshot.docs[0]
        if (firstDoc) {
          await updateDoc(doc(db, 'utilisateur', firstDoc.id), patch)
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
      await deleteDoc(doc(db, 'utilisateur', docId))
    } else {
      if (typeof idOrDocId === 'string') {
        await deleteDoc(doc(db, 'utilisateur', idOrDocId as string))
      } else {
        const q = query(accountsCollection, where('id', '==', idOrDocId))
        const snapshot = await getDocs(q)
        const firstDoc = snapshot.docs[0]
        if (firstDoc) {
          await deleteDoc(doc(db, 'utilisateur', firstDoc.id))
        }
      }
    }
    accounts.value.splice(index, 1)
  }

  fetchAccounts()

  return { accounts, loading, getById, add, update, remove, fetchAccounts }
})
