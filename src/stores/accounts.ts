import { ref } from 'vue'
import { defineStore } from 'pinia'
import { accounts as seedAccounts, type Account } from '@/data/accounts'

export const useAccountsStore = defineStore('accounts', () => {
  const accounts = ref<Account[]>(seedAccounts.map((account) => ({ ...account })))

  function getById(id: number) {
    return accounts.value.find((account) => account.id === id)
  }

  function add(data: Omit<Account, 'id'>) {
    const nextId = Math.max(0, ...accounts.value.map((account) => account.id)) + 1
    accounts.value.push({ ...data, id: nextId })
  }

  function update(id: number, patch: Partial<Account>) {
    const index = accounts.value.findIndex((account) => account.id === id)
    if (index !== -1) {
      accounts.value[index] = { ...accounts.value[index], ...patch }
    }
  }

  function remove(id: number) {
    const index = accounts.value.findIndex((account) => account.id === id)
    if (index !== -1) {
      accounts.value.splice(index, 1)
    }
  }

  return { accounts, getById, add, update, remove }
})
