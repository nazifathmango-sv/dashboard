import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  doc,
  setDoc,
} from 'firebase/firestore'
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signOut } from 'firebase/auth'
import type { StaffMember } from '@/data/staff'
import { staff as seedStaff } from '@/data/staff'
import { db, secondaryAuth } from '@/firebase'

function generateTemporaryPassword(): string {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 16)
}

export const useStaffStore = defineStore('staff', () => {
  const staff = ref<StaffMember[]>([])
  const loading = ref(false)
  const staffCollection = collection(db, 'staff')

  async function fetchStaff() {
    if (loading.value) return
    loading.value = true
    try {
      const snapshot = await getDocs(staffCollection)
      if (snapshot.empty) {
        staff.value = seedStaff.map((s) => ({ ...s }))
      } else {
        staff.value = snapshot.docs.map((firestoreDoc, idx) => {
          const data = firestoreDoc.data() as StaffMember & { id?: number }
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
    if (typeof idOrDocId === 'string') return staff.value.find((m) => m.docId === idOrDocId)
    return staff.value.find((member) => member.id === idOrDocId)
  }

  async function add(data: Omit<StaffMember, 'id' | 'docId'>) {
    const email = data.email.trim()
    const temporaryPassword = generateTemporaryPassword()

    // Créé via une instance Firebase secondaire pour ne pas remplacer la session
    // de l'administrateur actuellement connecté sur l'instance principale.
    const credential = await createUserWithEmailAndPassword(secondaryAuth, email, temporaryPassword)
    const uid = credential.user.uid

    try {
      await setDoc(doc(db, 'utilisateur', uid), {
        name: data.name,
        email,
        role: 'receptionniste',
        status: data.status,
      })
      await setDoc(doc(db, 'staff', uid), { ...data, email })
      await sendPasswordResetEmail(secondaryAuth, email, {
        url: `${window.location.origin}/reset`,
        handleCodeInApp: true,
      })
    } catch (error) {
      console.error('[staffStore.add] échec lors de la création du compte ou de l’envoi de l’email :', error)
      throw error
    } finally {
      await signOut(secondaryAuth)
    }

    staff.value.push({ ...(data as StaffMember), email, docId: uid })
  }

  async function update(idOrDocId: number | string, patch: Partial<StaffMember>) {
    const member = typeof idOrDocId === 'string'
      ? staff.value.find((item) => item.docId === idOrDocId)
      : staff.value.find((item) => item.id === idOrDocId)
    const docId = member?.docId
    if (docId) {
      await updateDoc(doc(db, 'staff', docId), patch)
      // Le document 'utilisateur' partage le même id que le document 'staff' pour les employés
      // avec un accès — on y répercute nom/statut (jamais l'email ou le rôle, non modifiables ici).
      const accountPatch: Record<string, unknown> = {}
      if (patch.name !== undefined) accountPatch.name = patch.name
      if (patch.status !== undefined) accountPatch.status = patch.status
      if (Object.keys(accountPatch).length > 0) {
        await updateDoc(doc(db, 'utilisateur', docId), accountPatch).catch(() => {})
      }
    } else {
      if (typeof idOrDocId === 'string') {
        await updateDoc(doc(db, 'staff', idOrDocId), patch)
      } else {
        const q = query(staffCollection, where('id', '==', idOrDocId))
        const snapshot = await getDocs(q)
        const found = snapshot.docs[0]
        if (found) {
          await updateDoc(doc(db, 'staff', found.id), patch)
        }
      }
    }
    if (member) Object.assign(member, patch)
  }

  async function remove(idOrDocId: number | string) {
    const index = typeof idOrDocId === 'string'
      ? staff.value.findIndex((item) => item.docId === idOrDocId)
      : staff.value.findIndex((item) => item.id === idOrDocId)
    if (index === -1) return
    const member = staff.value[index]
    const docId = member?.docId
    if (docId) {
      await deleteDoc(doc(db, 'staff', docId))
      // Le document 'utilisateur' partage le même id (uid Firebase Auth) que le document 'staff'
      // pour les employés créés avec un accès — le compte Auth lui-même ne peut pas être supprimé
      // depuis le client (limitation Firebase), il reste orphelin mais perd tout rôle/accès.
      await deleteDoc(doc(db, 'utilisateur', docId)).catch(() => {})
    } else {
      if (typeof idOrDocId === 'string') {
        await deleteDoc(doc(db, 'staff', idOrDocId))
      } else {
        const q = query(staffCollection, where('id', '==', idOrDocId))
        const snapshot = await getDocs(q)
        const found = snapshot.docs[0]
        if (found) {
          await deleteDoc(doc(db, 'staff', found.id))
        }
      }
    }
    staff.value.splice(index, 1)
  }

  fetchStaff()

  return { staff, loading, getById, add, update, remove, fetchStaff }
})
