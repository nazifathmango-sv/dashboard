<template>
  <div ref="rootRef" class="relative inline-block">
    <button
      type="button"
      class="flex items-center gap-2 px-4 py-2.5 bg-white border border-sand-300 rounded-xl text-sm text-navy-500 hover:border-sand-400 transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
      @click="open = !open"
    >
      <Icon name="calendar" class="w-4 h-4 text-navy-300" />
      <span class="font-medium">{{ label }}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
        class="w-3.5 h-3.5 text-navy-300 transition-transform duration-200"
        :class="{ 'rotate-180': open }"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
      </svg>
    </button>

    <Transition name="fade">
      <div
        v-if="open"
        class="absolute right-0 mt-2 z-50 bg-white rounded-2xl shadow-xl ring-1 ring-navy-500/5 p-4 w-[19rem] sm:w-[38rem]"
      >
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="sm:w-40 shrink-0 flex sm:flex-col gap-1 border-b sm:border-b-0 sm:border-r border-sand-200 pb-3 sm:pb-0 sm:pr-4 overflow-x-auto sm:overflow-visible">
            <button
              v-for="preset in presets"
              :key="preset.label"
              type="button"
              class="text-left text-sm px-3 py-2 rounded-lg whitespace-nowrap transition-colors duration-150 cursor-pointer"
              :class="isActivePreset(preset) ? 'bg-navy-500 text-sand-50' : 'text-navy-400 hover:bg-sand-100'"
              @click="applyPreset(preset)"
            >
              {{ preset.label }}
            </button>
          </div>

          <div class="flex-1">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <MonthGrid
                :year="leftMonth.year"
                :month="leftMonth.month"
                :start="pendingStart"
                :end="pendingEnd"
                :hover="hoverDate"
                @select="handleSelect"
                @hover="hoverDate = $event"
              >
                <template #nav-prev>
                  <button type="button" class="p-1 rounded-lg hover:bg-sand-100 cursor-pointer" @click="shiftMonths(-1)">
                    <Icon name="chevron-left" class="w-4 h-4 text-navy-400" />
                  </button>
                </template>
              </MonthGrid>
              <MonthGrid
                :year="rightMonth.year"
                :month="rightMonth.month"
                :start="pendingStart"
                :end="pendingEnd"
                :hover="hoverDate"
                @select="handleSelect"
                @hover="hoverDate = $event"
              >
                <template #nav-next>
                  <button type="button" class="p-1 rounded-lg hover:bg-sand-100 cursor-pointer" @click="shiftMonths(1)">
                    <Icon name="chevron-right" class="w-4 h-4 text-navy-400" />
                  </button>
                </template>
              </MonthGrid>
            </div>

            <div class="flex items-center justify-between mt-4 pt-3 border-t border-sand-200">
              <p class="text-xs text-navy-300">
                <span v-if="pendingStart">{{ formatDisplay(pendingStart) }}</span>
                <span v-if="pendingStart && pendingEnd"> → {{ formatDisplay(pendingEnd) }}</span>
                <span v-if="!pendingStart">Sélectionnez une date de début</span>
              </p>
              <div class="flex items-center gap-2">
                <BaseButton type="button" size="sm" variant="secondary" @click="cancel">Annuler</BaseButton>
                <BaseButton type="button" size="sm" :disabled="!pendingStart || !pendingEnd" @click="apply">
                  Appliquer
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import Icon from '@/components/ui/Icon.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import MonthGrid from '@/components/ui/MonthGrid.vue'

const props = defineProps<{
  modelValue: { start: string; end: string } | null
}>()
const emit = defineEmits<{
  'update:modelValue': [value: { start: string; end: string } | null]
}>()

const rootRef = ref<HTMLElement | null>(null)
const open = ref(false)
const hoverDate = ref<string | null>(null)

function toISO(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
function todayISO() {
  return toISO(new Date())
}
function addDays(iso: string, amount: number) {
  const date = new Date(iso)
  date.setDate(date.getDate() + amount)
  return toISO(date)
}
function startOfMonth(iso: string) {
  const date = new Date(iso)
  return toISO(new Date(date.getFullYear(), date.getMonth(), 1))
}
function addMonths(iso: string, amount: number) {
  const date = new Date(iso)
  return toISO(new Date(date.getFullYear(), date.getMonth() + amount, 1))
}

const pendingStart = ref<string | null>(props.modelValue?.start ?? null)
const pendingEnd = ref<string | null>(props.modelValue?.end ?? null)
const cursor = ref(startOfMonth(props.modelValue?.start ?? todayISO()))

function parseYearMonth(iso: string) {
  const [year, month] = iso.split('-').map(Number)
  return { year, month: month - 1 }
}

const leftMonth = computed(() => parseYearMonth(cursor.value))
const rightMonth = computed(() => parseYearMonth(addMonths(cursor.value, 1)))

function shiftMonths(amount: number) {
  cursor.value = addMonths(cursor.value, amount)
}

function handleSelect(dateISO: string) {
  if (!pendingStart.value || (pendingStart.value && pendingEnd.value)) {
    pendingStart.value = dateISO
    pendingEnd.value = null
  } else if (dateISO < pendingStart.value) {
    pendingEnd.value = pendingStart.value
    pendingStart.value = dateISO
  } else {
    pendingEnd.value = dateISO
  }
}

interface Preset {
  label: string
  range: () => { start: string; end: string }
}
const presets: Preset[] = [
  { label: "Aujourd'hui", range: () => ({ start: todayISO(), end: todayISO() }) },
  {
    label: '7 derniers jours',
    range: () => ({ start: addDays(todayISO(), -6), end: todayISO() }),
  },
  {
    label: '30 derniers jours',
    range: () => ({ start: addDays(todayISO(), -29), end: todayISO() }),
  },
  {
    label: 'Ce mois-ci',
    range: () => {
      const start = startOfMonth(todayISO())
      return { start, end: addDays(addMonths(start, 1), -1) }
    },
  },
  {
    label: '7 prochains jours',
    range: () => ({ start: todayISO(), end: addDays(todayISO(), 6) }),
  },
  {
    label: '30 prochains jours',
    range: () => ({ start: todayISO(), end: addDays(todayISO(), 29) }),
  },
]

function isActivePreset(preset: Preset) {
  if (!pendingStart.value || !pendingEnd.value) return false
  const range = preset.range()
  return range.start === pendingStart.value && range.end === pendingEnd.value
}
function applyPreset(preset: Preset) {
  const range = preset.range()
  pendingStart.value = range.start
  pendingEnd.value = range.end
  cursor.value = startOfMonth(range.start)
}

function formatDisplay(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

const label = computed(() => {
  if (!props.modelValue) return 'Toutes les dates'
  return `${formatDisplay(props.modelValue.start)} → ${formatDisplay(props.modelValue.end)}`
})

function apply() {
  if (pendingStart.value && pendingEnd.value) {
    emit('update:modelValue', { start: pendingStart.value, end: pendingEnd.value })
    open.value = false
  }
}
function cancel() {
  pendingStart.value = props.modelValue?.start ?? null
  pendingEnd.value = props.modelValue?.end ?? null
  open.value = false
}

watch(open, (isOpen) => {
  if (isOpen) {
    pendingStart.value = props.modelValue?.start ?? null
    pendingEnd.value = props.modelValue?.end ?? null
    cursor.value = startOfMonth(props.modelValue?.start ?? todayISO())
  }
})

function handleClickOutside(event: MouseEvent) {
  if (rootRef.value && !rootRef.value.contains(event.target as Node)) {
    open.value = false
  }
}
onMounted(() => document.addEventListener('mousedown', handleClickOutside))
onUnmounted(() => document.removeEventListener('mousedown', handleClickOutside))
</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
