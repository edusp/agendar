<template>
  <div>
    <div v-if="loading" class="flex justify-center py-10">
      <span class="loading loading-spinner loading-lg"></span>
    </div>
    <div v-else-if="error" class="alert alert-error">{{ error }}</div>
    <div v-else-if="bookings.length === 0" class="text-center py-10 text-base-content/50">
      Nenhum agendamento encontrado.
    </div>
    <div v-else class="flex flex-col gap-3">
      <BookingCard
        v-for="booking in bookings"
        :key="booking.id"
        :booking="booking"
        @click="$emit('select', booking)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import BookingCard from './BookingCard.vue'
import type { Booking } from '@/services/bookingService'

defineProps<{
  bookings: Booking[]
  loading?: boolean
  error?: string | null
}>()

defineEmits<{ select: [booking: Booking] }>()
</script>

<style scoped></style>
