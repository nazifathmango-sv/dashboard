import { ref } from 'vue'
import { defineStore } from 'pinia'
import { clients as seedClients, type Client } from '@/data/clients'

export const useClientsStore = defineStore('clients', () => {
  const clients = ref<Client[]>(seedClients.map((client) => ({ ...client })))

  function getById(id: number) {
    return clients.value.find((client) => client.id === id)
  }

  function add(data: Omit<Client, 'id'>) {
    const nextId = Math.max(0, ...clients.value.map((client) => client.id)) + 1
    clients.value.push({ ...data, id: nextId })
  }

  function update(id: number, patch: Partial<Client>) {
    const index = clients.value.findIndex((client) => client.id === id)
    if (index !== -1) {
      clients.value[index] = { ...clients.value[index], ...patch }
    }
  }

  function remove(id: number) {
    const index = clients.value.findIndex((client) => client.id === id)
    if (index !== -1) {
      clients.value.splice(index, 1)
    }
  }

  return { clients, getById, add, update, remove }
})
