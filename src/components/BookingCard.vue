<template>
  <div class="card bg-base-100 shadow border border-base-200 cursor-pointer hover:shadow-md transition-shadow" @click="$emit('click')">
    <div class="card-body p-4 gap-2">
      <div class="flex items-start justify-between">
        <div>
          <p class="font-semibold text-base">{{ clientName }}</p>
          <p class="text-sm text-base-content/60">{{ serviceName }}</p>
        </div>
        <div :class="statusClass" class="badge badge-sm">{{ booking.status_display ?? booking.status }}</div>
      </div>
      <div class="flex items-center gap-4 text-sm text-base-content/70">
        <span>📅 {{ booking.date }}</span>
        <span>🕐 {{ booking.start_time ?? booking.time }}</span>
      </div>
      <div v-if="staffName" class="text-sm text-base-content/60">
        ✂️ {{ staffName }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Booking } from '@/services/bookingService'

const props = defineProps<{ booking: Booking }>()
defineEmits<{ click: [] }>()

const clientName = computed(() => props.booking.client_name ?? 'Cliente')
const serviceName = computed(() =>
  typeof props.booking.service === 'string'
    ? props.booking.service
    : props.booking.service?.name ?? '—'
)
const staffName = computed(() =>
  typeof props.booking.staff === 'string'
    ? props.booking.staff
    : props.booking.staff?.name ?? null
)
const statusClass = computed(() => ({
  'badge-warning': props.booking.status === 'pending',
  'badge-success': props.booking.status === 'approved',
  'badge-error': props.booking.status === 'denied' || props.booking.status === 'cancelled'
}))
</script>

<style scoped></style>
