<template>
  <div class="p-6 max-w-7xl mx-auto font-sans bg-sand-50/50 min-h-screen rounded-3xl page-enter-anim">
    <PageHeader title="Administrateur" subtitle="Gestion des comptes ayant accès au tableau de bord.">
      <template #actions>
        <BaseButton @click="openAddPopup">
          <Icon name="plus" class="w-4 h-4" />
          Nouveau compte
        </BaseButton>
      </template>
    </PageHeader>

    <div class="mb-6 rounded-xl border border-gold-200 bg-gold-50 px-4 py-3 text-sm text-gold-600">
      À la création d'un compte, un email de définition de mot de passe est automatiquement envoyé à la
      personne concernée. La modification du profil (nom, rôle, statut) d'un compte existant n'envoie aucun
      email et n'affecte pas ses identifiants de connexion.
    </div>

    <p v-if="formError" class="mb-6 rounded-xl border border-coral-200 bg-coral-50 px-4 py-3 text-sm text-coral-500" role="alert">
      {{ formError }}
    </p>

    <PageCard class="mb-6">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Rechercher par nom ou rôle..."
        class="w-full md:w-96 px-4 py-2.5 bg-sand-50 border border-sand-300 rounded-xl text-sm text-navy-400 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:bg-white transition"
      />
    </PageCard>

    <EmptyState
      v-if="filteredAccounts.length === 0"
      title="Aucun compte trouvé"
      description="Essayez une autre recherche ou ajoutez un nouveau compte."
    />

    <template v-else>
      <div
        class="hidden md:grid grid-cols-4 gap-6 px-6 py-4 bg-white border-b font-semibold text-sm text-navy-300 uppercase rounded-t-2xl"
      >
        <button type="button" class="flex items-center gap-1 text-left cursor-pointer hover:text-navy-400" @click="toggleSort('name')">
          Nom et prénoms
          <SortIcon :active="sortKey === 'name'" :direction="sortDirection" />
        </button>
        <button type="button" class="flex items-center gap-1 text-left cursor-pointer hover:text-navy-400" @click="toggleSort('email')">
          Email
          <SortIcon :active="sortKey === 'email'" :direction="sortDirection" />
        </button>
        <button type="button" class="flex items-center gap-1 text-left cursor-pointer hover:text-navy-400" @click="toggleSort('role')">
          Rôle
          <SortIcon :active="sortKey === 'role'" :direction="sortDirection" />
        </button>
        <div class="text-center">Actions</div>
      </div>
      <TransitionGroup
        tag="div"
        name="list-row"
        class="bg-white overflow-hidden"
        :class="totalPages > 1 ? '' : 'rounded-b-2xl shadow-sm'"
      >
        <div
          v-for="(account, index) in paginatedAccounts"
          :key="account.id"
          :style="{ transitionDelay: `${Math.min(index * 20, 200)}ms` }"
          class="p-5 md:grid md:grid-cols-4 gap-6 items-center border-b border-l-4 hover:bg-sand-50 hover:shadow-sm transition-colors duration-150"
          :class="account.status === 'Actif' ? 'border-lagoon-500' : 'border-sand-200'"
        >
          <div class="flex items-center gap-3">
            <Avatar :name="account.name" />
            <div class="text-navy-500 font-medium">
              {{ account.name }}
            </div>
            <Badge :tone="account.status === 'Actif' ? 'green' : 'gray'">{{ account.status }}</Badge>
          </div>
          <div class="text-navy-300 text-sm mt-2 md:mt-0">
            {{ account.email }}
          </div>
          <div class="mt-2 md:mt-0">
            <Badge :tone="roleTone(account.role)">{{ account.role }}</Badge>
          </div>
          <div class="flex md:justify-center items-center gap-3 mt-3 md:mt-0">
            <BaseButton size="sm" variant="secondary" title="Modifier" @click="editAccount(account)">
              <Icon name="edit" class="w-4 h-4" />
            </BaseButton>
            <BaseButton size="sm" variant="danger" title="Supprimer" @click="confirmDelete(account.id)">
              <Icon name="trash" class="w-4 h-4" />
            </BaseButton>
          </div>
        </div>
      </TransitionGroup>
      <Pagination v-model:current-page="currentPage" :total-pages="totalPages" />
    </template>

    <Modal v-model="showPopup" size="lg">
      <h3 class="text-xl font-bold text-navy-500 text-center mb-6">
        {{ isEditing ? 'Modifier le compte' : 'Nouveau compte' }}
      </h3>
      <form @submit.prevent="saveAccount" class="space-y-4">
        <FormField
          v-model="form.name"
          label="Nom et prénoms"
          placeholder="MANGO Chefick"
          :invalid="!!errors.name"
          :error="errors.name"
        />
        <FormField
          v-model="form.email"
          type="email"
          label="Adresse Email"
          placeholder="exemple@sunbeachhotel.com"
          :invalid="!!errors.email"
          :error="errors.email"
        />
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectField v-model="form.role" label="Rôle">
            <option value="administrateur">Administrateur</option>
            <option value="receptionniste">Réceptionniste</option>
          </SelectField>
          <SelectField v-model="form.status" label="Statut">
            <option value="Actif">Actif</option>
            <option value="Inactif">Inactif</option>
          </SelectField>
        </div>
        <div class="flex justify-end gap-3 pt-5">
          <BaseButton type="button" variant="secondary" @click="closePopup">Annuler</BaseButton>
          <BaseButton type="submit" :loading="saving">{{ isEditing ? 'Confirmer la modification' : 'Enregistrer' }}</BaseButton>
        </div>
      </form>
    </Modal>

    <Modal :model-value="deleteId !== null" size="sm" @update:model-value="cancelDelete">
      <h3 class="text-lg font-bold text-navy-500 mb-2">Supprimer ce compte ?</h3>
      <p class="text-sm text-navy-300 mb-6">Cette action est irréversible.</p>
      <div class="flex justify-end gap-3">
        <BaseButton variant="secondary" @click="cancelDelete">Annuler</BaseButton>
        <BaseButton variant="danger" @click="deleteAccount">Supprimer</BaseButton>
      </div>
    </Modal>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAccountsStore } from '@/stores/accounts'
import type { Account, AccountRole } from '@/data/accounts'
import PageHeader from '@/components/ui/PageHeader.vue'
import PageCard from '@/components/ui/PageCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import FormField from '@/components/ui/FormField.vue'
import SelectField from '@/components/ui/SelectField.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import Badge from '@/components/ui/Badge.vue'
import Modal from '@/components/ui/Modal.vue'
import Icon from '@/components/ui/Icon.vue'
import Avatar from '@/components/ui/Avatar.vue'
import Pagination from '@/components/ui/Pagination.vue'
import SortIcon from '@/components/ui/SortIcon.vue'

const accountsStore = useAccountsStore()
const { accounts } = storeToRefs(accountsStore)

const PAGE_SIZE = 10

const searchQuery = ref('')
const showPopup = ref(false)
const isEditing = ref(false)
const editId = ref<number | null>(null)
const deleteId = ref<number | null>(null)
const errors = ref<Record<string, string>>({})
const sortKey = ref<'name' | 'email' | 'role'>('name')
const sortDirection = ref<'asc' | 'desc'>('asc')
const currentPage = ref(1)

type AccountFormData = Omit<Account, 'id'>

const emptyForm = (): AccountFormData => ({
  name: '',
  email: '',
  role: 'receptionniste',
  status: 'Actif',
})
const form = ref<AccountFormData>(emptyForm())

const filteredAccounts = computed(() => {
  const search = searchQuery.value.toLowerCase()
  return accounts.value.filter(
    (account) => account.name.toLowerCase().includes(search) || account.role.toLowerCase().includes(search),
  )
})

const sortedAccounts = computed(() => {
  const dir = sortDirection.value === 'asc' ? 1 : -1
  return [...filteredAccounts.value].sort(
    (a, b) => String(a[sortKey.value]).localeCompare(String(b[sortKey.value]), 'fr') * dir,
  )
})

const totalPages = computed(() => Math.max(1, Math.ceil(sortedAccounts.value.length / PAGE_SIZE)))

const paginatedAccounts = computed(() =>
  sortedAccounts.value.slice((currentPage.value - 1) * PAGE_SIZE, currentPage.value * PAGE_SIZE),
)

watch(searchQuery, () => {
  currentPage.value = 1
})

function toggleSort(key: typeof sortKey.value) {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDirection.value = 'asc'
  }
}

const roleTone = (role: AccountRole) => {
  switch (role) {
    case 'administrateur':
      return 'amber'
    case 'receptionniste':
    default:
      return 'blue'
  }
}

function validate(): boolean {
  errors.value = {}
  if (!form.value.name.trim()) errors.value.name = 'Le nom est requis.'
  if (!form.value.email.trim()) errors.value.email = "L'email est requis."
  return Object.keys(errors.value).length === 0
}

const saving = ref(false)
const formError = ref('')

const openAddPopup = () => {
  isEditing.value = false
  editId.value = null
  form.value = emptyForm()
  errors.value = {}
  formError.value = ''
  showPopup.value = true
}
const editAccount = (account: Account) => {
  isEditing.value = true
  editId.value = account.id
  const { id, ...rest } = account
  form.value = { ...rest }
  errors.value = {}
  formError.value = ''
  showPopup.value = true
}
const closePopup = () => {
  showPopup.value = false
}
const saveAccount = async () => {
  if (!validate()) return
  formError.value = ''
  saving.value = true
  try {
    if (isEditing.value && editId.value !== null) {
      await accountsStore.update(editId.value, form.value)
    } else {
      await accountsStore.add(form.value)
    }
    closePopup()
  } catch (error: any) {
    console.error('[saveAccount] erreur lors de l’enregistrement du compte :', error)
    if (error.code === 'auth/email-already-in-use') {
      formError.value = 'Un compte existe déjà avec cette adresse email.'
    } else if (error.code === 'auth/invalid-email') {
      formError.value = 'Adresse email invalide.'
    } else {
      formError.value = "Une erreur est survenue lors de l'enregistrement du compte."
    }
  } finally {
    saving.value = false
  }
}
const confirmDelete = (id: number) => {
  deleteId.value = id
}
const cancelDelete = () => {
  deleteId.value = null
}
const deleteAccount = () => {
  if (deleteId.value !== null) {
    accountsStore.remove(deleteId.value)
    deleteId.value = null
  }
}
</script>
<style scoped>
.list-row-enter-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.list-row-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
</style>
