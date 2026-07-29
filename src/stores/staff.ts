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
import type { StaffMember } from '@/data/staff'
import { staff as seedStaff } from '@/data/staff'
import { db } from '@/firebase'

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
    const newDoc = await addDoc(staffCollection, { ...data })
    staff.value.push({ ...(data as StaffMember), docId: newDoc.id })
  }

  async function update(idOrDocId: number | string, patch: Partial<StaffMember>) {
    const member = typeof idOrDocId === 'string'
      ? staff.value.find((item) => item.docId === idOrDocId)
      : staff.value.find((item) => item.id === idOrDocId)
    const docId = member?.docId
    if (docId) {
      await updateDoc(doc(db, 'staff', docId), patch)
    } else {
      if (typeof idOrDocId === 'string') {
        await updateDoc(doc(db, 'staff', idOrDocId), patch)
      } else {
        const q = query(staffCollection, where('id', '==', idOrDocId))
        const snapshot = await getDocs(q)
        if (!snapshot.empty) {
          await updateDoc(doc(db, 'staff', snapshot.docs[0].id), patch)
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
    } else {
      if (typeof idOrDocId === 'string') {
        await deleteDoc(doc(db, 'staff', idOrDocId))
      } else {
        const q = query(staffCollection, where('id', '==', idOrDocId))
        const snapshot = await getDocs(q)
        if (!snapshot.empty) {
          await deleteDoc(doc(db, 'staff', snapshot.docs[0].id))
        }
      }
    }
    staff.value.splice(index, 1)
  }

  fetchStaff()

  return { staff, loading, getById, add, update, remove, fetchStaff }
})
