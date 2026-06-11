<template>
  <div class="min-h-screen flex flex-col">
    <div class="navbar bg-base-200 px-4">
      <button class="btn btn-ghost btn-sm mr-2" @click="router.back()">←</button>
      <span class="font-semibold">Bloquear Horários</span>
    </div>

    <div class="p-4 flex flex-col gap-4 flex-1">
      <div class="alert alert-info text-sm">
        Bloqueie horários para que clientes não possam agendar neste período.
      </div>

      <div class="form-control">
        <label class="label"><span class="label-text">Data</span></label>
        <input type="date" class="input input-bordered" v-model="selectedDate" :min="today" />
      </div>

      <div>
        <label class="label"><span class="label-text">Horário para bloquear</span></label>
        <TimeSlotPicker
          :slots="slots"
          :loading="slotsLoading"
          v-model:selected="selectedTime"
        />
      </div>

      <div v-if="errorMsg" class="alert alert-error text-sm">{{ errorMsg }}</div>
      <div v-if="successMsg" class="alert alert-success text-sm">{{ successMsg }}</div>

      <button
        class="btn btn-warning mt-auto"
        :disabled="!selectedDate || !selectedTime || saving"
        @click="handleBlock"
      >
        <span v-if="saving" class="loading loading-spinner loading-sm"></span>
        Bloquear Horário
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import TimeSlotPicker from '@/components/TimeSlotPicker.vue'
import { bookingService } from '@/services/bookingService'
import { useAuthStore } from '@/stores/auth'
import type { TimeSlot } from '@/services/bookingService'

const router = useRouter()
const auth = useAuthStore()

const today = new Date().toISOString().slice(0, 10)
const selectedDate = ref(today)
const selectedTime = ref<string | null>(null)
const slots = ref<TimeSlot[]>([])
const slotsLoading = ref(false)
const saving = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

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

async function handleBlock() {
  if (!selectedDate.value || !selectedTime.value) return
  saving.value = true
  errorMsg.value = ''
  try {
    await bookingService.lockSlot({
      date: selectedDate.value,
      time: selectedTime.value,
      service_ids: [],
      staff_id: auth.user!.staffId
    })
    successMsg.value = `Horário ${selectedTime.value} bloqueado para ${selectedDate.value}.`
    selectedTime.value = null
    await loadSlots(selectedDate.value)
  } catch (err: any) {
    if (err.response?.status === 409) {
      errorMsg.value = 'Este horário já está ocupado ou bloqueado.'
    } else {
      errorMsg.value = 'Falha ao bloquear. Tente novamente.'
    }
  } finally {
    saving.value = false
  }
}
</script>

<style scoped></style>
