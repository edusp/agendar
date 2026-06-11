<template>
  <div>
    <div v-if="loading" class="flex justify-center py-6">
      <span class="loading loading-spinner"></span>
    </div>
    <div v-else-if="slots.length === 0" class="text-center text-base-content/50 py-4">
      Nenhum horário disponível.
    </div>
    <div v-else class="grid grid-cols-4 gap-2">
      <button
        v-for="slot in slots"
        :key="slot.time"
        :disabled="!slot.available"
        :class="[
          'btn btn-sm',
          selected === slot.time ? 'btn-primary' : 'btn-outline',
          !slot.available ? 'btn-disabled opacity-40' : ''
        ]"
        @click="slot.available && $emit('update:selected', slot.time)"
      >
        {{ slot.time }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TimeSlot } from '@/services/bookingService'

defineProps<{
  slots: TimeSlot[]
  loading?: boolean
  selected?: string | null
}>()

defineEmits<{ 'update:selected': [time: string] }>()
</script>

<style scoped></style>
