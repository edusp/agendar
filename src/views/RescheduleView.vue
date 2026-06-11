<template>
  <div class="min-h-screen flex flex-col">
    <div class="navbar bg-base-200 px-4">
      <button class="btn btn-ghost btn-sm mr-2" @click="router.back()">←</button>
      <span class="font-semibold">Reagendar</span>
    </div>

    <div class="p-4 flex flex-col gap-4 flex-1">
      <div class="form-control">
        <label class="label"><span class="label-text">Nova data</span></label>
        <input type="date" class="input input-bordered" v-model="selectedDate" :min="today" />
      </div>

      <div>
        <label class="label"><span class="label-text">Horário disponível</span></label>
        <TimeSlotPicker
          :slots="slots"
          :loading="slotsLoading"
          v-model:selected="selectedTime"
        />
      </div>

      <div v-if="errorMsg" class="alert alert-error text-sm">{{ errorMsg }}</div>
      <div v-if="successMsg" class="alert alert-success text-sm">{{ successMsg }}</div>

      <button
        class="btn btn-primary mt-auto"
        :disabled="!selectedDate || !selectedTime || saving"
        @click="handleReschedule"
      >
        <span v-if="saving" class="loading loading-spinner loading-sm"></span>
        Confirmar Reagendamento
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TimeSlotPicker from '@/components/TimeSlotPicker.vue'
import { bookingService } from '@/services/bookingService'
import { useBookingsStore } from '@/stores/bookings'
import { useAuthStore } from '@/stores/auth'
import type { TimeSlot } from '@/services/bookingService'

const route = useRoute()
const router = useRouter()
const bookingsStore = useBookingsStore()
const auth = useAuthStore()

const today = new Date().toISOString().slice(0, 10)
const selectedDate = ref(today)
const selectedTime = ref<string | null>(null)
const slots = ref<TimeSlot[]>([])
const slotsLoading = ref(false)
const saving = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

const booking = [...bookingsStore.myBookings, ...bookingsStore.unassignedBookings]
  .find(b => String(b.id) === route.params.id)

async function loadSlots(date: string) {
  slotsLoading.value = true
  selectedTime.value = null
  try {
    slots.value = await bookingService.getSlots(date, auth.user?.staffId)
  } finally {
    slotsLoading.value = false
  }
}

watch(selectedDate, loadSlots, { immediate: true })

async function handleReschedule() {
  if (!selectedDate.value || !selectedTime.value || !booking) return
  saving.value = true
  errorMsg.value = ''
  try {
    const serviceIds = typeof booking.service === 'object' && 'id' in booking.service
      ? [(booking.service as any).id]
      : [1]

    await bookingService.lockSlot({
      date: selectedDate.value,
      time: selectedTime.value,
      service_ids: serviceIds,
      staff_id: auth.user!.staffId
    })

    await bookingService.cancel(booking.id)

    await bookingService.create({
      service_ids: serviceIds,
      date: selectedDate.value,
      time: selectedTime.value,
      staff_id: auth.user!.staffId,
      notes: '',
      want_reminder: false
    })

    bookingsStore.removeBooking(booking.id)
    successMsg.value = 'Reagendado com sucesso!'
    setTimeout(() => router.push('/bookings'), 1500)
  } catch {
    errorMsg.value = 'Falha ao reagendar. Tente outro horário.'
  } finally {
    saving.value = false
  }
}
</script>

<style scoped></style>
