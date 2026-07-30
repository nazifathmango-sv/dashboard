<template>
  <div>
    <div class="flex items-center justify-between mb-2">
      <slot name="nav-prev" />
      <p class="text-sm font-semibold text-navy-500 capitalize">{{ monthLabel }}</p>
      <slot name="nav-next" />
    </div>
    <div class="grid grid-cols-7 gap-0.5 text-center">
      <span v-for="d in weekdayLabels" :key="d" class="text-[0.65rem] font-semibold uppercase text-navy-200 py-1">
        {{ d }}
      </span>
      <span v-for="n in leadingBlanks" :key="`blank-${n}`" />
      <button
        v-for="day in days"
        :key="day.iso"
        type="button"
        class="text-sm h-8 w-8 mx-auto rounded-lg transition-colors duration-100 cursor-pointer"
        :class="dayClasses(day.iso)"
        @mouseenter="$emit('hover', day.iso)"
        @click="$emit('select', day.iso)"
      >
        {{ day.day }}
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  year: number
  month: number
  start: string | null
  end: string | null
  hover: string | null
}>()
defineEmits<{
  select: [iso: string]
  hover: [iso: string]
}>()

const weekdayLabels = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

const monthLabel = computed(() =>
  new Date(props.year, props.month, 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
)

const leadingBlanks = computed(() => {
  const firstDay = new Date(props.year, props.month, 1).getDay()
  return (firstDay + 6) % 7
})

function toISO(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const days = computed(() => {
  const daysInMonth = new Date(props.year, props.month + 1, 0).getDate()
  return Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1
    const iso = toISO(new Date(props.year, props.month, day))
    return { day, iso }
  })
})

function dayClasses(iso: string) {
  const { start, end, hover } = props
  const isStart = iso === start
  const isEnd = iso === end
  const rangeEnd = end ?? hover
  const inRange = start && rangeEnd && iso > start && iso < rangeEnd && start <= rangeEnd

  if (isStart || isEnd) return 'bg-navy-500 text-sand-50 font-semibold'
  if (inRange) return 'bg-gold-100 text-navy-500'
  return 'text-navy-400 hover:bg-sand-100'
}
</script>
