<template>
  <div class="p-6 max-w-7xl mx-auto font-sans bg-sand-50/50 min-h-screen rounded-3xl page-enter-anim">
    <PageHeader title="Personnel" subtitle="Gestion des employés de l'hôtel.">
      <template #actions>
        <BaseButton @click="openAddPopup">
          <Icon name="plus" class="w-4 h-4" />
          Nouvel employé
        </BaseButton>
      </template>
    </PageHeader>

    <div class="mb-6 rounded-xl border border-gold-200 bg-gold-50 px-4 py-3 text-sm text-gold-600">
      À l'ajout d'un employé, un email de définition de mot de passe est automatiquement envoyé pour lui
      donner accès au tableau de bord (rôle réceptionniste). La modification d'une fiche existante n'envoie
      aucun email et n'affecte pas ses identifiants de connexion.
    </div>

    <p v-if="formError" class="mb-6 rounded-xl border border-coral-200 bg-coral-50 px-4 py-3 text-sm text-coral-500" role="alert">
      {{ formError }}
    </p>

    <PageCard class="mb-6">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Rechercher par nom ou poste..."
        class="w-full md:w-96 px-4 py-2.5 bg-sand-50 border border-sand-300 rounded-xl text-sm text-navy-400 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:bg-white transition"
      />
    </PageCard>

    <EmptyState
      v-if="filteredStaff.length === 0"
      title="Aucun employé trouvé"
      description="Essayez une autre recherche ou ajoutez un nouvel employé."
    />

    <template v-else>
      <div
        class="hidden md:grid grid-cols-4 gap-6 px-6 py-4 bg-white border-b font-semibold text-sm text-navy-300 uppercase rounded-t-2xl"
      >
        <button
          type="button"
          class="flex items-center gap-1 text-left cursor-pointer hover:text-navy-400 transition-colors duration-150 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2"
          @click="toggleSort('name')"
        >
          Nom et prénoms
          <SortIcon :active="sortKey === 'name'" :direction="sortDirection" />
        </button>
        <button
          type="button"
          class="flex items-center gap-1 text-left cursor-pointer hover:text-navy-400 transition-colors duration-150 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2"
          @click="toggleSort('poste')"
        >
          Poste
          <SortIcon :active="sortKey === 'poste'" :direction="sortDirection" />
        </button>
        <button
          type="button"
          class="flex items-center gap-1 text-left cursor-pointer hover:text-navy-400 transition-colors duration-150 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2"
          @click="toggleSort('phone')"
        >
          Téléphone
          <SortIcon :active="sortKey === 'phone'" :direction="sortDirection" />
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
          v-for="(member, index) in paginatedStaff"
          :key="member.id"
          :style="{ transitionDelay: `${Math.min(index * 20, 200)}ms` }"
          class="p-5 md:grid md:grid-cols-4 gap-6 items-center border-b border-l-4 hover:bg-sand-50 hover:shadow-sm transition-colors duration-150"
          :class="member.status === 'Actif' ? 'border-lagoon-500' : 'border-sand-300'"
        >
          <div class="flex items-center gap-3 min-w-0">
            <Avatar :name="member.name" class="shrink-0" />
            <div class="min-w-0">
              <div class="text-navy-500 font-medium truncate">
                {{ member.name }}
              </div>
              <div class="text-xs text-navy-200 truncate">{{ member.email }}</div>
            </div>
            <Badge class="shrink-0" :tone="member.status === 'Actif' ? 'green' : 'gray'">{{ member.status }}</Badge>
          </div>
          <div class="text-navy-300 text-sm mt-2 md:mt-0">
            {{ member.poste }}
          </div>
          <div class="text-navy-300 text-sm mt-2 md:mt-0">
            {{ member.phone }}
          </div>
          <div class="flex md:justify-center items-center gap-3 mt-3 md:mt-0">
            <BaseButton size="sm" variant="secondary" title="Modifier" @click="editStaff(member)">
              <Icon name="edit" class="w-4 h-4" />
            </BaseButton>
            <BaseButton size="sm" variant="danger" title="Supprimer" @click="confirmDelete(member.id)">
              <Icon name="trash" class="w-4 h-4" />
            </BaseButton>
          </div>
        </div>
      </TransitionGroup>
      <Pagination v-model:current-page="currentPage" :total-pages="totalPages" />
    </template>

    <Modal v-model="showPopup" size="lg">
      <h3 class="text-xl font-bold text-navy-500 text-center mb-6">
        {{ isEditing ? "Modifier l'employé" : 'Nouvel employé' }}
      </h3>
      <form @submit.prevent="saveStaff" class="space-y-4">
        <FormField
          v-model="form.name"
          label="Nom et prénoms"
          placeholder="AGBOTON Rachelle"
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
        <FormField
          v-model="form.poste"
          label="Poste"
          placeholder="Réceptionniste"
          :invalid="!!errors.poste"
          :error="errors.poste"
        />
        <FormField
          v-model="form.phone"
          type="tel"
          label="Téléphone"
          placeholder="+229 01 00 00 00 00"
          :invalid="!!errors.phone"
          :error="errors.phone"
        />
        <SelectField v-model="form.status" label="Statut">
          <option value="Actif">Actif</option>
          <option value="Inactif">Inactif</option>
        </SelectField>
        <div class="flex justify-end gap-3 pt-5">
          <BaseButton type="button" variant="secondary" @click="closePopup">Annuler</BaseButton>
          <BaseButton type="submit" :loading="saving">{{ isEditing ? 'Confirmer la modification' : 'Enregistrer' }}</BaseButton>
        </div>
      </form>
    </Modal>

    <Modal :model-value="deleteId !== null" size="sm" @update:model-value="cancelDelete">
      <h3 class="text-lg font-bold text-navy-500 mb-2">Supprimer cet employé ?</h3>
      <p class="text-sm text-navy-300 mb-6">Cette action est irréversible.</p>
      <div class="flex justify-end gap-3">
        <BaseButton variant="secondary" @click="cancelDelete">Annuler</BaseButton>
        <BaseButton variant="danger" @click="deleteStaff">Supprimer</BaseButton>
      </div>
    </Modal>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useStaffStore } from '@/stores/staff'
import type { StaffMember } from '@/data/staff'
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

const staffStore = useStaffStore()
const { staff } = storeToRefs(staffStore)

const PAGE_SIZE = 10

const searchQuery = ref('')
const showPopup = ref(false)
const isEditing = ref(false)
const editId = ref<number | null>(null)
const deleteId = ref<number | null>(null)
const errors = ref<Record<string, string>>({})
const sortKey = ref<'name' | 'poste' | 'phone'>('name')
const sortDirection = ref<'asc' | 'desc'>('asc')
const currentPage = ref(1)

type StaffFormData = Omit<StaffMember, 'id'>

const emptyForm = (): StaffFormData => ({
  name: '',
  poste: '',
  phone: '',
  email: '',
  status: 'Actif',
})
const form = ref<StaffFormData>(emptyForm())

const filteredStaff = computed(() => {
  const search = searchQuery.value.toLowerCase()
  return staff.value.filter(
    (member) => member.name.toLowerCase().includes(search) || member.poste.toLowerCase().includes(search),
  )
})

const sortedStaff = computed(() => {
  const dir = sortDirection.value === 'asc' ? 1 : -1
  return [...filteredStaff.value].sort(
    (a, b) => String(a[sortKey.value]).localeCompare(String(b[sortKey.value]), 'fr') * dir,
  )
})

const totalPages = computed(() => Math.max(1, Math.ceil(sortedStaff.value.length / PAGE_SIZE)))

const paginatedStaff = computed(() =>
  sortedStaff.value.slice((currentPage.value - 1) * PAGE_SIZE, currentPage.value * PAGE_SIZE),
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

function validate(): boolean {
  errors.value = {}
  if (!form.value.name.trim()) errors.value.name = 'Le nom est requis.'
  if (!form.value.email.trim()) errors.value.email = "L'email est requis."
  if (!form.value.poste.trim()) errors.value.poste = 'Le poste est requis.'
  if (!form.value.phone.trim()) errors.value.phone = 'Le téléphone est requis.'
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
const editStaff = (member: StaffMember) => {
  isEditing.value = true
  editId.value = member.id
  const { id, ...rest } = member
  form.value = { ...rest }
  errors.value = {}
  formError.value = ''
  showPopup.value = true
}
const closePopup = () => {
  showPopup.value = false
}
const saveStaff = async () => {
  if (!validate()) return
  formError.value = ''
  saving.value = true
  try {
    if (isEditing.value && editId.value !== null) {
      await staffStore.update(editId.value, form.value)
    } else {
      await staffStore.add(form.value)
    }
    closePopup()
  } catch (error: any) {
    console.error('[saveStaff] erreur lors de l’enregistrement de l’employé :', error)
    if (error.code === 'auth/email-already-in-use') {
      formError.value = 'Un compte existe déjà avec cette adresse email.'
    } else if (error.code === 'auth/invalid-email') {
      formError.value = 'Adresse email invalide.'
    } else {
      formError.value = "Une erreur est survenue lors de l'enregistrement de l'employé."
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
const deleteStaff = () => {
  if (deleteId.value !== null) {
    staffStore.remove(deleteId.value)
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
