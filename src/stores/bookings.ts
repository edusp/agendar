import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Booking } from '@/services/bookingService'

export const useBookingsStore = defineStore('bookings', () => {
  const myBookings = ref<Booking[]>([])
  const unassignedBookings = ref<Booking[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const pendingCount = computed(
    () => [...myBookings.value, ...unassignedBookings.value]
      .filter(b => b.status === 'pending').length
  )

  function setMyBookings(list: Booking[]) { myBookings.value = list }
  function setUnassigned(list: Booking[]) { unassignedBookings.value = list }

  function updateBookingStatus(id: number | string, status: string) {
    const update = (list: Booking[]) => {
      const b = list.find(x => x.id === id)
      if (b) b.status = status
    }
    update(myBookings.value)
    update(unassignedBookings.value)
  }

  function removeBooking(id: number | string) {
    myBookings.value = myBookings.value.filter(b => b.id !== id)
    unassignedBookings.value = unassignedBookings.value.filter(b => b.id !== id)
  }

  return { myBookings, unassignedBookings, loading, error, pendingCount, setMyBookings, setUnassigned, updateBookingStatus, removeBooking }
})
