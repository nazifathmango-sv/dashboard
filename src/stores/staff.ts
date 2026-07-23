import { ref } from 'vue'
import { defineStore } from 'pinia'
import { staff as seedStaff, type StaffMember } from '@/data/staff'

export const useStaffStore = defineStore('staff', () => {
  const staff = ref<StaffMember[]>(seedStaff.map((member) => ({ ...member })))

  function getById(id: number) {
    return staff.value.find((member) => member.id === id)
  }

  function add(data: Omit<StaffMember, 'id'>) {
    const nextId = Math.max(0, ...staff.value.map((member) => member.id)) + 1
    staff.value.push({ ...data, id: nextId })
  }

  function update(id: number, patch: Partial<StaffMember>) {
    const index = staff.value.findIndex((member) => member.id === id)
    if (index !== -1) {
      staff.value[index] = { ...staff.value[index], ...patch }
    }
  }

  function remove(id: number) {
    const index = staff.value.findIndex((member) => member.id === id)
    if (index !== -1) {
      staff.value.splice(index, 1)
    }
  }

  return { staff, getById, add, update, remove }
})
