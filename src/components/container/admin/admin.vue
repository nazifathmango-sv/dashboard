<template>
  <div class="p-6 max-w-7xl mx-auto font-sans bg-gray-50/50 min-h-screen rounded-3xl">
    <PageHeader title="Administrateur" subtitle="Gestion des comptes ayant accès au tableau de bord.">
      <template #actions>
        <BaseButton @click="openAddPopup">Nouveau compte</BaseButton>
      </template>
    </PageHeader>

    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Rechercher par nom ou rôle..."
        class="w-full md:w-96 px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:bg-white transition"
      />
    </div>

    <EmptyState
      v-if="filteredAccounts.length === 0"
      title="Aucun compte trouvé"
      description="Essayez une autre recherche ou ajoutez un nouveau compte."
    />

    <template v-else>
      <div
        class="hidden md:grid grid-cols-4 gap-6 px-6 py-4 bg-white border-b font-semibold text-sm text-gray-500 uppercase rounded-t-2xl"
      >
        <div>Nom et prénoms</div>
        <div>Email</div>
        <div>Rôle</div>
        <div class="text-center">Actions</div>
      </div>
      <div class="bg-white rounded-b-2xl shadow-sm overflow-hidden">
        <div
          v-for="(account, index) in filteredAccounts"
          :key="account.id"
          class="p-5 md:grid md:grid-cols-4 gap-6 items-center border-b hover:bg-gray-50"
        >
          <div class="flex items-center gap-3">
            <div class="text-gray-900 font-medium">
              {{ account.name }}
            </div>
            <Badge :tone="account.status === 'Actif' ? 'green' : 'gray'">{{ account.status }}</Badge>
          </div>
          <div class="text-gray-600 text-sm mt-2 md:mt-0">
            {{ account.email }}
          </div>
          <div class="mt-2 md:mt-0">
            <Badge :tone="roleTone(account.role)">{{ account.role }}</Badge>
          </div>
          <div class="flex md:justify-center items-center gap-3 mt-3 md:mt-0">
            <BaseButton size="sm" variant="secondary" @click="editAccount(account, index)">Modifier</BaseButton>
            <BaseButton size="sm" variant="danger" @click="confirmDelete(index)">Supprimer</BaseButton>
          </div>
        </div>
      </div>
    </template>

    <div
      v-if="showPopup"
      @click="closePopup"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <div
        @click.stop
        class="bg-white p-6 rounded-2xl shadow-xl w-full max-w-lg mx-4 overflow-y-auto max-h-[90vh]"
      >
        <h3 class="text-xl font-bold text-gray-800 text-center mb-6">
          {{ isEditing ? 'Modifier le compte' : 'Nouveau compte' }}
        </h3>
        <form @submit.prevent="saveAccount" class="space-y-4">
          <FormField v-model="form.name" label="Nom et prénoms" required placeholder="MANGO Chefick" />
          <FormField v-model="form.email" type="email" label="Adresse Email" required placeholder="exemple@sunbeachhotel.com" />
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="text-xs font-semibold text-gray-500 uppercase">Rôle</label>
              <select
                v-model="form.role"
                class="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:bg-white transition"
              >
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Staff">Staff</option>
              </select>
            </div>
            <div>
              <label class="text-xs font-semibold text-gray-500 uppercase">Statut</label>
              <select
                v-model="form.status"
                class="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:bg-white transition"
              >
                <option value="Actif">Actif</option>
                <option value="Inactif">Inactif</option>
              </select>
            </div>
          </div>
          <div class="flex justify-end gap-3 pt-5">
            <BaseButton type="button" variant="secondary" @click="closePopup">Annuler</BaseButton>
            <BaseButton type="submit">{{ isEditing ? 'Confirmer la modification' : 'Enregistrer' }}</BaseButton>
          </div>
        </form>
      </div>
    </div>

    <div
      v-if="deleteIndex !== null"
      @click="cancelDelete"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <div @click.stop class="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm mx-4">
        <h3 class="text-lg font-bold text-gray-800 mb-2">Supprimer ce compte ?</h3>
        <p class="text-sm text-gray-500 mb-6">Cette action est irréversible.</p>
        <div class="flex justify-end gap-3">
          <BaseButton variant="secondary" @click="cancelDelete">Annuler</BaseButton>
          <BaseButton variant="danger" @click="deleteAccount">Supprimer</BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { accounts as initialAccounts, type Account, type AccountRole } from '@/data/accounts'
import PageHeader from '@/components/ui/PageHeader.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import FormField from '@/components/ui/FormField.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import Badge from '@/components/ui/Badge.vue'

const searchQuery = ref('')
const showPopup = ref(false)
const isEditing = ref(false)
const editIndex = ref<number | null>(null)
const deleteIndex = ref<number | null>(null)
const accounts = ref<Account[]>(initialAccounts)

const emptyForm = (): Account => ({
  id: 0,
  name: '',
  email: '',
  role: 'Staff',
  status: 'Actif',
})
const form = ref<Account>(emptyForm())

const filteredAccounts = computed(() => {
  const search = searchQuery.value.toLowerCase()
  return accounts.value.filter(
    (account) => account.name.toLowerCase().includes(search) || account.role.toLowerCase().includes(search),
  )
})

const roleTone = (role: AccountRole) => {
  switch (role) {
    case 'Admin':
      return 'amber'
    case 'Manager':
      return 'blue'
    case 'Staff':
    default:
      return 'gray'
  }
}

const openAddPopup = () => {
  isEditing.value = false
  editIndex.value = null
  form.value = emptyForm()
  showPopup.value = true
}
const editAccount = (account: Account, index: number) => {
  isEditing.value = true
  editIndex.value = index
  form.value = { ...account }
  showPopup.value = true
}
const closePopup = () => {
  showPopup.value = false
}
const saveAccount = () => {
  if (isEditing.value && editIndex.value !== null) {
    accounts.value[editIndex.value] = { ...form.value }
  } else {
    accounts.value.push({ ...form.value, id: accounts.value.length + 1 })
  }
  closePopup()
}
const confirmDelete = (index: number) => {
  deleteIndex.value = index
}
const cancelDelete = () => {
  deleteIndex.value = null
}
const deleteAccount = () => {
  if (deleteIndex.value !== null) {
    accounts.value.splice(deleteIndex.value, 1)
    deleteIndex.value = null
  }
}
</script>
