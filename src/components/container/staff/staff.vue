<template>
  <div class="p-6 max-w-7xl mx-auto font-sans bg-gray-50/50 min-h-screen rounded-3xl">
    <PageHeader title="Personnel" subtitle="Gestion des employés de l'hôtel.">
      <template #actions>
        <BaseButton @click="openAddPopup">Nouvel employé</BaseButton>
      </template>
    </PageHeader>

    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Rechercher par nom ou poste..."
        class="w-full md:w-96 px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:bg-white transition"
      />
    </div>

    <EmptyState
      v-if="filteredStaff.length === 0"
      title="Aucun employé trouvé"
      description="Essayez une autre recherche ou ajoutez un nouvel employé."
    />

    <template v-else>
      <div
        class="hidden md:grid grid-cols-4 gap-6 px-6 py-4 bg-white border-b font-semibold text-sm text-gray-500 uppercase rounded-t-2xl"
      >
        <div>Nom et prénoms</div>
        <div>Poste</div>
        <div>Téléphone</div>
        <div class="text-center">Actions</div>
      </div>
      <div class="bg-white rounded-b-2xl shadow-sm overflow-hidden">
        <div
          v-for="(member, index) in filteredStaff"
          :key="member.id"
          class="p-5 md:grid md:grid-cols-4 gap-6 items-center border-b hover:bg-gray-50"
        >
          <div class="flex items-center gap-3">
            <div class="text-gray-900 font-medium">
              {{ member.name }}
            </div>
            <Badge :tone="member.status === 'Actif' ? 'green' : 'gray'">{{ member.status }}</Badge>
          </div>
          <div class="text-gray-600 text-sm mt-2 md:mt-0">
            {{ member.poste }}
          </div>
          <div class="text-gray-600 text-sm mt-2 md:mt-0">
            {{ member.phone }}
          </div>
          <div class="flex md:justify-center items-center gap-3 mt-3 md:mt-0">
            <BaseButton size="sm" variant="secondary" @click="editStaff(member, index)">Modifier</BaseButton>
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
          {{ isEditing ? "Modifier l'employé" : 'Nouvel employé' }}
        </h3>
        <form @submit.prevent="saveStaff" class="space-y-4">
          <FormField v-model="form.name" label="Nom et prénoms" required placeholder="AGBOTON Rachelle" />
          <FormField v-model="form.poste" label="Poste" required placeholder="Réceptionniste" />
          <FormField v-model="form.phone" type="tel" label="Téléphone" required placeholder="+229 01 00 00 00 00" />
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
        <h3 class="text-lg font-bold text-gray-800 mb-2">Supprimer cet employé ?</h3>
        <p class="text-sm text-gray-500 mb-6">Cette action est irréversible.</p>
        <div class="flex justify-end gap-3">
          <BaseButton variant="secondary" @click="cancelDelete">Annuler</BaseButton>
          <BaseButton variant="danger" @click="deleteStaff">Supprimer</BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { staff as initialStaff, type StaffMember } from '@/data/staff'
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
const staff = ref<StaffMember[]>(initialStaff)

const emptyForm = (): StaffMember => ({
  id: 0,
  name: '',
  poste: '',
  phone: '',
  status: 'Actif',
})
const form = ref<StaffMember>(emptyForm())

const filteredStaff = computed(() => {
  const search = searchQuery.value.toLowerCase()
  return staff.value.filter(
    (member) => member.name.toLowerCase().includes(search) || member.poste.toLowerCase().includes(search),
  )
})

const openAddPopup = () => {
  isEditing.value = false
  editIndex.value = null
  form.value = emptyForm()
  showPopup.value = true
}
const editStaff = (member: StaffMember, index: number) => {
  isEditing.value = true
  editIndex.value = index
  form.value = { ...member }
  showPopup.value = true
}
const closePopup = () => {
  showPopup.value = false
}
const saveStaff = () => {
  if (isEditing.value && editIndex.value !== null) {
    staff.value[editIndex.value] = { ...form.value }
  } else {
    staff.value.push({ ...form.value, id: staff.value.length + 1 })
  }
  closePopup()
}
const confirmDelete = (index: number) => {
  deleteIndex.value = index
}
const cancelDelete = () => {
  deleteIndex.value = null
}
const deleteStaff = () => {
  if (deleteIndex.value !== null) {
    staff.value.splice(deleteIndex.value, 1)
    deleteIndex.value = null
  }
}
</script>
