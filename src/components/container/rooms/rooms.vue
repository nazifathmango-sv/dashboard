<template>
  <div class="p-6 max-w-7xl mx-auto font-sans bg-sand-50/50 min-h-screen rounded-3xl page-enter-anim">
    <PageHeader title="Nos Chambres" subtitle="Aperçu des chambres et suites disponibles à l'hôtel.">
      <template #actions>
        <BaseButton @click="openAddPopup">
          <Icon name="plus" class="w-4 h-4" />
          Ajouter une chambre
        </BaseButton>
      </template>
    </PageHeader>

    <EmptyState
      v-if="rooms.length === 0"
      title="Aucune chambre disponible"
      description="Les chambres apparaîtront ici une fois ajoutées."
    />

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="room in rooms"
        :key="room.id"
        class="group rounded-2xl overflow-hidden shadow-sm border border-sand-200 bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      >
        <div class="relative h-56 w-full overflow-hidden">
          <img
            :src="room.image"
            :alt="room.titre"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>

          <div class="absolute top-3 right-3">
            <Badge :tone="room.statut === 'Disponible' ? 'green' : 'red'">{{ room.statut }}</Badge>
          </div>

          <h3 class="absolute bottom-4 left-5 text-xl font-bold text-white">
            {{ room.titre }}
          </h3>
        </div>

        <div class="p-5">
          <p class="text-sm text-navy-300 mb-4">
            {{ room.description }}
          </p>

          <div class="grid grid-cols-3 gap-2 text-center mb-4">
            <div class="bg-gold-50 rounded-lg p-2.5 transition-colors duration-200">
              <p class="text-xs text-navy-300 font-medium">Prix</p>
              <p class="text-sm font-semibold text-navy-500 mt-0.5">{{ room.prix }}</p>
            </div>
            <div class="bg-gold-50 rounded-lg p-2.5 transition-colors duration-200">
              <p class="text-xs text-navy-300 font-medium">Personnes</p>
              <p class="text-sm font-semibold text-navy-500 mt-0.5">{{ room.personnes }}</p>
            </div>
            <div class="bg-gold-50 rounded-lg p-2.5 transition-colors duration-200">
              <p class="text-xs text-navy-300 font-medium">Lit</p>
              <p class="text-sm font-semibold text-navy-500 mt-0.5">{{ room.lit }}</p>
            </div>
          </div>

          <div v-if="room.equipements.length" class="flex flex-wrap gap-2 mb-4">
            <span
              v-for="item in room.equipements"
              :key="item"
              class="inline-flex items-center gap-1.5 text-xs font-medium text-navy-300 bg-sand-50 rounded-lg px-2.5 py-1.5 transition-colors duration-200"
            >
              <Icon :name="equipementIcon(item)" class="w-3.5 h-3.5" />
              {{ item }}
            </span>
          </div>

          <div class="flex items-center justify-between gap-2 pt-4 mt-4 border-t border-sand-200">
            <BaseButton size="sm" variant="secondary" @click="router.push('/planning')">
              <Icon name="calendar" class="w-4 h-4" />
              Voir le planning
            </BaseButton>
            <div class="flex items-center gap-2">
              <BaseButton size="sm" variant="secondary" @click="editRoom(room)">
                <Icon name="edit" class="w-4 h-4" />
              </BaseButton>
              <BaseButton size="sm" variant="danger" @click="confirmDelete(room.id)">
                <Icon name="trash" class="w-4 h-4" />
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Modal v-model="showPopup" size="lg">
      <h3 class="text-xl font-bold text-navy-500 text-center mb-6">
        {{ isEditing ? 'Modifier la chambre' : 'Nouvelle chambre' }}
      </h3>
      <form @submit.prevent="saveRoom" class="space-y-6">
        <div>
          <h4 class="text-sm font-semibold text-navy-400 mb-3 pb-2 border-b border-sand-200">
            Informations générales
          </h4>
          <div class="space-y-4">
            <FormField
              v-model="form.titre"
              label="Titre"
              placeholder="Suite Royale"
              :invalid="!!errors.titre"
              :error="errors.titre"
            />
            <FormField
              v-model="form.description"
              label="Description"
              placeholder="Une suite spacieuse offrant..."
              multiline
              :invalid="!!errors.description"
              :error="errors.description"
            />
            <FormField v-model="form.image" label="Image (chemin ou URL)" placeholder="/img/room.webp" />
          </div>
        </div>

        <div>
          <h4 class="text-sm font-semibold text-navy-400 mb-3 pb-2 border-b border-sand-200">
            Tarification & Capacité
          </h4>
          <div class="space-y-4">
            <FormField
              v-model="form.prix"
              label="Prix"
              placeholder="120 000 FCFA / nuit"
              :invalid="!!errors.prix"
              :error="errors.prix"
            />
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                v-model="form.personnes"
                label="Personnes"
                placeholder="2 adultes"
                :invalid="!!errors.personnes"
                :error="errors.personnes"
              />
              <FormField
                v-model="form.lit"
                label="Lit"
                placeholder="King Size"
                :invalid="!!errors.lit"
                :error="errors.lit"
              />
            </div>
            <SelectField v-model="form.statut" label="Statut">
              <option value="Disponible">Disponible</option>
              <option value="Complet">Complet</option>
            </SelectField>
          </div>
        </div>

        <div>
          <h4 class="text-sm font-semibold text-navy-400 mb-3 pb-2 border-b border-sand-200">Équipements</h4>
          <div class="flex gap-2 mb-3">
            <input
              v-model="newEquipement"
              type="text"
              placeholder="Ex: Wi-Fi gratuit"
              class="flex-1 px-4 py-2.5 bg-sand-50 border border-sand-300 rounded-xl text-sm text-navy-400 placeholder:text-navy-200 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus:bg-white"
              @keydown.enter.prevent="addEquipement"
            />
            <BaseButton type="button" variant="secondary" @click="addEquipement">Ajouter</BaseButton>
          </div>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="(item, index) in form.equipements"
              :key="item"
              class="inline-flex items-center gap-1.5 text-xs font-medium text-navy-300 bg-sand-50 rounded-lg px-2.5 py-1.5"
            >
              {{ item }}
              <button
                type="button"
                class="text-navy-200 hover:text-navy-400 transition-colors duration-150 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
                @click="form.equipements.splice(index, 1)"
              >
                ×
              </button>
            </span>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-2">
          <BaseButton type="button" variant="secondary" @click="closePopup">Annuler</BaseButton>
          <BaseButton type="submit">{{ isEditing ? 'Confirmer la modification' : 'Enregistrer' }}</BaseButton>
        </div>
      </form>
    </Modal>

    <Modal :model-value="deleteId !== null" size="sm" @update:model-value="cancelDelete">
      <h3 class="text-lg font-bold text-navy-500 mb-2">Supprimer cette chambre ?</h3>
      <p class="text-sm text-navy-300 mb-6">Cette action est irréversible.</p>
      <div class="flex justify-end gap-3">
        <BaseButton variant="secondary" @click="cancelDelete">Annuler</BaseButton>
        <BaseButton variant="danger" @click="deleteRoom">Supprimer</BaseButton>
      </div>
    </Modal>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useRoomsStore } from '@/stores/rooms'
import type { Room } from '@/data/rooms'
import PageHeader from '@/components/ui/PageHeader.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import FormField from '@/components/ui/FormField.vue'
import SelectField from '@/components/ui/SelectField.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import Badge from '@/components/ui/Badge.vue'
import Modal from '@/components/ui/Modal.vue'
import Icon from '@/components/ui/Icon.vue'

const router = useRouter()
const roomsStore = useRoomsStore()
const { rooms } = storeToRefs(roomsStore)

const showPopup = ref(false)
const isEditing = ref(false)
const editId = ref<number | null>(null)
const deleteId = ref<number | null>(null)
const newEquipement = ref('')
const errors = ref<Record<string, string>>({})

type RoomFormData = Omit<Room, 'id'>

const emptyForm = (): RoomFormData => ({
  titre: '',
  image: '',
  description: '',
  prix: '',
  personnes: '',
  lit: '',
  statut: 'Disponible',
  equipements: [],
})
const form = ref<RoomFormData>(emptyForm())

function equipementIcon(label: string) {
  const lower = label.toLowerCase()
  if (lower.includes('wi-fi') || lower.includes('wifi')) return 'wifi'
  if (lower.includes('clim')) return 'ac'
  if (lower.includes('vue')) return 'sea-view'
  if (lower.includes('bain') || lower.includes('douche')) return 'bath'
  return 'star'
}

function addEquipement() {
  const value = newEquipement.value.trim()
  if (value && !form.value.equipements.includes(value)) {
    form.value.equipements.push(value)
  }
  newEquipement.value = ''
}

function validate(): boolean {
  errors.value = {}
  if (!form.value.titre.trim()) errors.value.titre = 'Le titre est requis.'
  if (!form.value.description.trim()) errors.value.description = 'La description est requise.'
  if (!form.value.prix.trim()) errors.value.prix = 'Le prix est requis.'
  if (!form.value.personnes.trim()) errors.value.personnes = 'La capacité est requise.'
  if (!form.value.lit.trim()) errors.value.lit = 'Le type de lit est requis.'
  return Object.keys(errors.value).length === 0
}

const openAddPopup = () => {
  isEditing.value = false
  editId.value = null
  form.value = emptyForm()
  errors.value = {}
  showPopup.value = true
}
const editRoom = (room: Room) => {
  isEditing.value = true
  editId.value = room.id
  const { id, ...rest } = room
  form.value = { ...rest, equipements: [...rest.equipements] }
  errors.value = {}
  showPopup.value = true
}
const closePopup = () => {
  showPopup.value = false
}
const saveRoom = () => {
  if (!validate()) return
  if (isEditing.value && editId.value !== null) {
    roomsStore.update(editId.value, form.value)
  } else {
    roomsStore.add(form.value)
  }
  closePopup()
}
const confirmDelete = (id: number) => {
  deleteId.value = id
}
const cancelDelete = () => {
  deleteId.value = null
}
const deleteRoom = () => {
  if (deleteId.value !== null) {
    roomsStore.remove(deleteId.value)
    deleteId.value = null
  }
}
</script>
