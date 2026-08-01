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
  addDoc,
  setDoc,
} from 'firebase/firestore'

import type { StaffMember } from '@/data/staff'
import { staff as seedStaff } from '@/data/staff'
import { db } from '@/firebase'

export const useStaffStore = defineStore('staff', () => {
  const staff = ref<StaffMember[]>([])
  const loading = ref(false)

  const staffCollection = collection(db, 'staff')

  // =========================
  // RÉCUPÉRER LES EMPLOYÉS
  // =========================

  async function fetchStaff() {
    if (loading.value) return

    loading.value = true

    try {
      const snapshot = await getDocs(staffCollection)

      if (snapshot.empty) {
        staff.value = seedStaff.map((member) => ({
          ...member,
        }))
      } else {
        staff.value = snapshot.docs.map((firestoreDoc, index) => {
          const data = firestoreDoc.data() as StaffMember & {
            id?: number
          }

          return {
            ...data,
            id: data.id ?? index + 1,
            docId: firestoreDoc.id,
          }
        })
      }
    } catch (error) {
      console.error(
        '[staffStore.fetchStaff] Erreur lors du chargement du personnel :',
        error,
      )
    } finally {
      loading.value = false
    }
  }

  // =========================
  // RECHERCHER UN EMPLOYÉ
  // =========================

  function getById(idOrDocId: number | string) {
    if (typeof idOrDocId === 'string') {
      return staff.value.find(
        (member) => member.docId === idOrDocId,
      )
    }

    return staff.value.find(
      (member) => member.id === idOrDocId,
    )
  }

  // =========================
  // AJOUTER UN EMPLOYÉ
  // =========================
  //
  // IMPORTANT :
  // Aucun compte Firebase Authentication
  // Aucun mot de passe
  // Aucun email envoyé
  //
  // L'employé est uniquement enregistré
  // dans Firestore / staff.
  // =========================

  async function add(
    data: Omit<StaffMember, 'id' | 'docId'>,
  ) {
    const email = data.email.trim()

    const docRef = await addDoc(staffCollection, {
      ...data,
      email,
    })

    const newMember: StaffMember = {
      ...data,
      email,
      docId: docRef.id,
      id: Date.now(),
    }

    staff.value.push(newMember)
  }

  // =========================
  // MODIFIER UN EMPLOYÉ
  // =========================

  async function update(
    idOrDocId: number | string,
    patch: Partial<StaffMember>,
  ) {
    const member =
      typeof idOrDocId === 'string'
        ? staff.value.find(
            (item) => item.docId === idOrDocId,
          )
        : staff.value.find(
            (item) => item.id === idOrDocId,
          )

    if (member?.docId) {
      await updateDoc(
        doc(db, 'staff', member.docId),
        patch,
      )
    } else if (typeof idOrDocId === 'string') {
      await updateDoc(
        doc(db, 'staff', idOrDocId),
        patch,
      )
    } else {
      const q = query(
        staffCollection,
        where('id', '==', idOrDocId),
      )

      const snapshot = await getDocs(q)
      const found = snapshot.docs[0]

      if (found) {
        await updateDoc(
          doc(db, 'staff', found.id),
          patch,
        )
      }
    }

    if (member) {
      Object.assign(member, patch)
    }
  }

  // =========================
  // SUPPRIMER UN EMPLOYÉ
  // =========================

  async function remove(
    idOrDocId: number | string,
  ) {
    const index =
      typeof idOrDocId === 'string'
        ? staff.value.findIndex(
            (item) => item.docId === idOrDocId,
          )
        : staff.value.findIndex(
            (item) => item.id === idOrDocId,
          )

    if (index === -1) return

    const member = staff.value[index]

    if (member?.docId) {
      await deleteDoc(
        doc(db, 'staff', member.docId),
      )
    } else if (typeof idOrDocId === 'string') {
      await deleteDoc(
        doc(db, 'staff', idOrDocId),
      )
    } else {
      const q = query(
        staffCollection,
        where('id', '==', idOrDocId),
      )

      const snapshot = await getDocs(q)
      const found = snapshot.docs[0]

      if (found) {
        await deleteDoc(
          doc(db, 'staff', found.id),
        )
      }
    }

    staff.value.splice(index, 1)
  }

  
  fetchStaff()

  return {
    staff,
    loading,
    getById,
    add,
    update,
    remove,
    fetchStaff,
  }
})
