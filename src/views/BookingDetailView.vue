<template>
  <div class="min-h-screen flex flex-col">
    <div class="navbar bg-base-200 px-4">
      <button class="btn btn-ghost btn-sm mr-2" @click="router.back()">←</button>
      <span class="font-semibold">Detalhe do Agendamento</span>
    </div>

    <div v-if="!booking" class="flex justify-center py-10">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <div v-else class="p-4 flex flex-col gap-4 flex-1">
      <div class="card bg-base-100 shadow border border-base-200">
        <div class="card-body gap-3">
          <div class="flex justify-between items-start">
            <h2 class="card-title">{{ clientName }}</h2>
            <div :class="statusClass" class="badge">{{ booking.status_display ?? booking.status }}</div>
          </div>
          <div class="grid grid-cols-2 gap-y-2 text-sm">
            <span class="text-base-content/60">Serviço</span>
            <span>{{ serviceName }}</span>
            <span class="text-base-content/60">Data</span>
            <span>{{ booking.date }}</span>
            <span class="text-base-content/60">Horário</span>
            <span>{{ booking.start_time ?? booking.time }}</span>
            <span class="text-base-content/60">Barbeiro</span>
            <span>{{ staffName ?? 'Não atribuído' }}</span>
          </div>
          <div v-if="booking.notes" class="text-sm text-base-content/70 bg-base-200 rounded p-2">
            {{ booking.notes }}
          </div>
        </div>
      </div>

      <div v-if="booking.status === 'pending'" class="flex flex-col gap-2">
        <button class="btn btn-success" :disabled="!!actionLoading" @click="handleApprove">
          <span v-if="actionLoading === 'approve'" class="loading loading-spinner loading-sm"></span>
          Aprovar
        </button>
        <button class="btn btn-outline btn-warning" :disabled="!!actionLoading" @click="router.push(`/bookings/${booking.id}/reschedule`)">
          Reagendar
        </button>
        <button class="btn btn-error btn-outline" :disabled="!!actionLoading" @click="denyModal?.open()">
          Recusar
        </button>
      </div>

      <div v-else-if="booking.status === 'approved'" class="flex flex-col gap-2">
        <button class="btn btn-outline btn-warning" :disabled="!!actionLoading" @click="router.push(`/bookings/${booking.id}/reschedule`)">
          Reagendar
        </button>
      </div>

      <div v-if="actionError" class="alert alert-error text-sm">{{ actionError }}</div>
    </div>

    <ConfirmModal
      ref="denyModal"
      title="Recusar agendamento"
      message="Tem certeza que deseja recusar este agendamento? O cliente será notificado."
      confirm-label="Recusar"
      confirm-class="btn-error"
      :loading="actionLoading === 'deny'"
      @confirmed="handleDeny"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ConfirmModal from '@/components/ConfirmModal.vue'
import { useBookingsStore } from '@/stores/bookings'
import { useBookings } from '@/composables/useBookings'
import type { Booking } from '@/services/bookingService'

const route = useRoute()
const router = useRouter()
const bookingsStore = useBookingsStore()
const { approve, deny } = useBookings()

const booking = ref<Booking | null>(null)
const actionLoading = ref<'approve' | 'deny' | null>(null)
const actionError = ref('')
const denyModal = ref<InstanceType<typeof ConfirmModal> | null>(null)

const clientName = computed(() => booking.value?.client_name ?? 'Cliente')
const serviceName = computed(() =>
  typeof booking.value?.service === 'string' ? booking.value.service : booking.value?.service?.name ?? '—'
)
const staffName = computed(() =>
  typeof booking.value?.staff === 'string' ? booking.value.staff : booking.value?.staff?.name ?? null
)
const statusClass = computed(() => ({
  'badge-warning': booking.value?.status === 'pending',
  'badge-success': booking.value?.status === 'approved',
  'badge-error': ['denied', 'cancelled'].includes(booking.value?.status ?? '')
}))

onMounted(() => {
  const id = route.params.id as string
  const found = [...bookingsStore.myBookings, ...bookingsStore.unassignedBookings].find(b => String(b.id) === id)
  booking.value = found ?? null
})

async function handleApprove() {
  if (!booking.value) return
  actionLoading.value = 'approve'
  actionError.value = ''
  try {
    await approve(booking.value.id)
    booking.value.status = 'approved'
  } catch (e: any) {
    actionError.value = e.message
  } finally {
    actionLoading.value = null
  }
}

async function handleDeny() {
  if (!booking.value) return
  actionLoading.value = 'deny'
  actionError.value = ''
  try {
    await deny(booking.value.id)
    router.push('/bookings')
  } catch (e: any) {
    actionError.value = e.message
    actionLoading.value = null
  }
}
</script>

<style scoped></style>
