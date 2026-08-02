<template>
  <div class="p-6 max-w-7xl mx-auto font-sans bg-sand-50/50 min-h-screen rounded-3xl page-enter-anim">

    <PageHeader
      :title="pageTitle"
      subtitle="Découvrez l'ensemble des prestations proposées à nos clients."
    >
      <template #actions>

        <BaseButton
          v-if="activeCategory"
          variant="ghost"
          size="sm"
          @click="clearCategoryFilter"
        >
          <Icon name="x-mark" class="w-3.5 h-3.5" />
          Voir tous les services
        </BaseButton>

        <BaseButton @click="openAddPopup">
          <Icon name="plus" class="w-4 h-4" />
          Ajouter un service
        </BaseButton>

      </template>
    </PageHeader>


    <!-- Aucun service -->

    <EmptyState
      v-if="filteredServices.length === 0"
      :title="
        activeCategory
        ? 'Aucun service dans cette catégorie'
        : 'Aucun service disponible'
      "
      :description="
        activeCategory
        ? 'Ajoutez un service dans cette catégorie ou revenez à la liste complète.'
        : 'Les services apparaîtront ici une fois ajoutés.'
      "
    />


    <!-- Liste de tous les services -->

    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >

      <div
        v-for="service in filteredServices"
        :key="service.docId || service.id"
        class="group relative rounded-2xl overflow-hidden shadow-sm border border-sand-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      >


        <!-- Carte service -->

        <button
          type="button"
          class="block w-full text-left cursor-pointer"
          @click="handleClick(service)"
        >

          <div class="relative h-56 w-full overflow-hidden">


            <img
              :src="service.image"
              :alt="service.titre"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />


            <div
              class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
            ></div>



            <!-- Icône catégorie -->

            <div
              class="absolute top-4 left-4 w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white p-2"
            >

              <ServiceIcon :icon="service.icon" />

            </div>



            <!-- Texte -->

            <div
              class="absolute bottom-0 left-0 right-0 p-5"
            >

              <h3 class="text-xl font-bold text-white mb-1">
                {{ service.titre }}
              </h3>


              <p class="text-sm text-white/80 line-clamp-2">
                {{ service.description }}
              </p>


            </div>


          </div>


        </button>



        <!-- Actions -->

        <div
          class="absolute top-3 right-3 flex items-center gap-2"
        >


          <button
            type="button"
            title="Modifier"
            class="w-8 h-8 rounded-lg bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition"
            @click.stop="editService(service)"
          >

            <Icon
              name="edit"
              class="w-4 h-4"
            />

          </button>



          <button
            type="button"
            title="Supprimer"
            class="w-8 h-8 rounded-lg bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-coral-500/80 transition"
            @click.stop="confirmDelete(service.id)"
          >

            <Icon
              name="trash"
              class="w-4 h-4"
            />

          </button>


        </div>


      </div>


    </div>
        <!-- Modal ajout / modification -->

    <Modal
      v-model="showPopup"
      size="lg"
    >

      <h3
        class="text-xl font-bold text-navy-500 text-center mb-6"
      >
        {{ isEditing ? 'Modifier le service' : 'Nouveau service' }}
      </h3>


      <form
        @submit.prevent="saveService"
        class="space-y-6"
      >


        <!-- Informations générales -->

        <div>

          <h4
            class="text-sm font-semibold text-navy-400 mb-3 pb-2 border-b border-sand-200"
          >
            Informations générales
          </h4>


          <div class="space-y-4">


            <FormField
              v-model="form.titre"
              label="Titre"
              placeholder="Salle de Sport"
              :invalid="!!errors.titre"
              :error="errors.titre"
            />



            <SelectField
              v-model="form.icon"
              label="Catégorie"
              :invalid="!!errors.icon"
              :error="errors.icon"
            >

              <option value="">
                Sélectionner...
              </option>


              <option
                v-for="option in iconOptions"
                :key="option.value"
                :value="option.value"
              >

                {{ option.label }}

              </option>


            </SelectField>




            <FormField
              v-model="form.description"
              label="Description"
              placeholder="Un espace pensé pour..."
              multiline
              :invalid="!!errors.description"
              :error="errors.description"
            />



            <ImageUpload
              v-model="form.image"
              label="Photo du service"
              folder="services"
            />


          </div>


        </div>





        <!-- Informations pratiques -->

        <div>


          <h4
            class="text-sm font-semibold text-navy-400 mb-3 pb-2 border-b border-sand-200"
          >
            Informations pratiques
          </h4>



          <div
            class="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >


            <FormField
              v-model="form.horaires"
              label="Horaires"
              placeholder="9h00 - 20h00"
              :invalid="!!errors.horaires"
              :error="errors.horaires"
            />



            <FormField
              v-model="form.info"
              label="Tarif / Capacité"
              placeholder="À partir de 15 000 FCFA"
              :invalid="!!errors.info"
              :error="errors.info"
            />


          </div>


        </div>





        <!-- Caractéristiques -->

        <div>


          <h4
            class="text-sm font-semibold text-navy-400 mb-3 pb-2 border-b border-sand-200"
          >
            Caractéristiques
          </h4>



          <div class="flex gap-2 mb-3">


            <input
              v-model="newCaracteristique"
              type="text"
              placeholder="Ex: Sauna"
              class="flex-1 px-4 py-2.5 bg-sand-50 border border-sand-300 rounded-xl text-sm"
              @keydown.enter.prevent="addCaracteristique"
            />



            <BaseButton
              type="button"
              variant="secondary"
              @click="addCaracteristique"
            >
              Ajouter
            </BaseButton>


          </div>




          <div
            class="flex flex-wrap gap-2"
          >


            <span
              v-for="(item,index) in form.caracteristiques"
              :key="item"
              class="inline-flex items-center gap-1.5 text-xs font-medium text-navy-300 bg-sand-50 rounded-lg px-2.5 py-1.5"
            >

              {{ item }}


              <button
                type="button"
                class="text-navy-200 hover:text-navy-400"
                @click="form.caracteristiques.splice(index,1)"
              >

                ×

              </button>


            </span>


          </div>


        </div>





        <!-- Boutons -->

        <div
          class="flex justify-end gap-3 pt-2"
        >


          <BaseButton
            type="button"
            variant="secondary"
            @click="closePopup"
          >
            Annuler
          </BaseButton>



          <BaseButton
            type="submit"
          >

            {{ isEditing ? 'Confirmer la modification' : 'Enregistrer' }}

          </BaseButton>


        </div>



      </form>


    </Modal>






    <!-- Suppression -->

    <Modal
      :model-value="deleteId !== null"
      size="sm"
      @update:model-value="cancelDelete"
    >


      <h3
        class="text-lg font-bold text-navy-500 mb-2"
      >
        Supprimer ce service ?
      </h3>


      <p
        class="text-sm text-navy-300 mb-6"
      >
        Cette action est irréversible.
      </p>



      <div
        class="flex justify-end gap-3"
      >

        <BaseButton
          variant="secondary"
          @click="cancelDelete"
        >
          Annuler
        </BaseButton>



        <BaseButton
          variant="danger"
          @click="deleteService"
        >
          Supprimer
        </BaseButton>


      </div>


    </Modal>


  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'

import { useServicesStore } from '@/stores/services'
import type { Service, ServiceIcon as ServiceIconType } from '@/data/services'

import PageHeader from '@/components/ui/PageHeader.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import FormField from '@/components/ui/FormField.vue'
import SelectField from '@/components/ui/SelectField.vue'
import ImageUpload from '@/components/ui/ImageUpload.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import Modal from '@/components/ui/Modal.vue'
import Icon from '@/components/ui/Icon.vue'
import ServiceIcon from '@/components/ui/ServiceIcon.vue'


const route = useRoute()
const router = useRouter()


const servicesStore = useServicesStore()

const { services } = storeToRefs(servicesStore)



/* catégories disponibles */

const iconOptions: { value: ServiceIconType; label: string }[] = [

  { value:'bed', label:'Chambres' },

  { value:'restaurant', label:'Restaurant' },

  { value:'party', label:'Salle de Réception' },

  { value:'nightclub', label:'Boite de Nuit' },

  { value:'spa', label:'Spa' },

  { value:'games', label:'Salle de Jeux' },

  { value:'sport', label:'Salle de Sport' },

]





/* filtre catégorie */

const activeCategory = computed(() => {

  const value = route.query.category

  return typeof value === 'string' &&
    iconOptions.some((item)=> item.value === value)

    ? value as ServiceIconType

    : null

})



const filteredServices = computed(()=>{

  if(!activeCategory.value)
    return services.value


  return services.value.filter(
    service => service.icon === activeCategory.value
  )

})



const pageTitle = computed(()=>{

  if(!activeCategory.value)
    return "Services de l'hôtel"


  return iconOptions.find(
    item => item.value === activeCategory.value
  )?.label ?? "Services de l'hôtel"

})



function clearCategoryFilter(){

  router.push({
    name:'service'
  })

}





/* popup */

const showPopup = ref(false)

const isEditing = ref(false)

const editId = ref<number|null>(null)

const deleteId = ref<number|null>(null)

const newCaracteristique = ref('')

const errors = ref<Record<string,string>>({})





type ServiceFormData =
 Omit<Service,'id'|'docId'|'slug'>





const emptyForm = ():ServiceFormData => ({

 titre:'',

 image:'',

 icon:'' as ServiceIconType,

 description:'',

 horaires:'',

 info:'',

 caracteristiques:[]

})



const form = ref<ServiceFormData>(
  emptyForm()
)






/* slug */

function slugify(value:string){

 return value

 .toLowerCase()

 .normalize('NFD')

 .replace(/[\u0300-\u036f]/g,'')

 .replace(/[^a-z0-9]+/g,'-')

 .replace(/(^-|-$)/g,'')

}



function uniqueSlug(
 titre:string,
 excludeId:number|null
){

 const base = slugify(titre) || 'service'

 let slug = base

 let count = 2


 while(
 services.value.some(
  service =>
   service.slug === slug &&
   service.id !== excludeId
 )
 ){

  slug = `${base}-${count}`

  count++

 }


 return slug

}






/* caractéristiques */

function addCaracteristique(){

 const value = newCaracteristique.value.trim()


 if(
  value &&
  !form.value.caracteristiques.includes(value)
 ){

  form.value.caracteristiques.push(value)

 }


 newCaracteristique.value=''

}





/* validation */

function validate(){

 errors.value={}


 if(!form.value.titre.trim())
  errors.value.titre='Le titre est requis.'


 if(!form.value.icon)
  errors.value.icon='La catégorie est requise.'


 if(!form.value.description.trim())
  errors.value.description='La description est requise.'


 if(!form.value.horaires.trim())
  errors.value.horaires='Les horaires sont requis.'


 if(!form.value.info.trim())
  errors.value.info='Le tarif ou la capacité est requis.'



 return Object.keys(errors.value).length===0

}






/* ajout */

function openAddPopup(){

 isEditing.value=false

 editId.value=null


 form.value={
  ...emptyForm(),

  icon:
   activeCategory.value ??
   '' as ServiceIconType

 }


 errors.value={}

 showPopup.value=true

}





/* modification */

function editService(service:Service){

 isEditing.value=true

 editId.value=service.id


 form.value={

  titre:service.titre,

  image:service.image,

  icon:service.icon,

  description:service.description,

  horaires:service.horaires,

  info:service.info,

  caracteristiques:[
   ...service.caracteristiques
  ]

 }


 errors.value={}

 showPopup.value=true

}





function closePopup(){

 showPopup.value=false

}





/* sauvegarde */

async function saveService(){

 if(!validate())
  return


 const slug = uniqueSlug(
  form.value.titre,
  editId.value
 )



 if(
  isEditing.value &&
  editId.value !== null
 ){

  await servicesStore.update(
    editId.value,
    {
      ...form.value,
      slug
    }
  )


 }else{


  await servicesStore.add({

    ...form.value,

    slug

  })


 }


 closePopup()

}






/* suppression */

function confirmDelete(id:number){

 deleteId.value=id

}



function cancelDelete(){

 deleteId.value=null

}



async function deleteService(){

 if(deleteId.value!==null){

  await servicesStore.remove(
    deleteId.value
  )


  deleteId.value=null

 }

}






/* détail service */

function handleClick(service:Service){

 router.push({

  name:'service-details',

  params:{
    slug:service.slug
  }

 })

}

</script>
