import { onMounted } from 'vue'
import { useBookingsStore } from '@/stores/bookings'
import { useAuthStore } from '@/stores/auth'
import { bookingService } from '@/services/bookingService'

export function useBookings() {
  const store = useBookingsStore()
  const auth = useAuthStore()

  async function fetchMyBookings() {
    store.loading = true
    store.error = null
    try {
      const list = await bookingService.getMyBookings()
      store.setMyBookings(list)
    } catch {
      store.error = 'Falha ao carregar agendamentos.'
    } finally {
      store.loading = false
    }
  }

  async function fetchUnassigned() {
    store.loading = true
    store.error = null
    try {
      const today = new Date().toISOString().slice(0, 10)
      const list = await bookingService.getBookingsByDate(today)
      store.setUnassigned(list.filter((b) => !b.staff))
    } catch {
      store.error = 'Falha ao carregar agendamentos sem barbeiro.'
    } finally {
      store.loading = false
    }
  }

  async function approve(id: number | string) {
    const prev = store.myBookings.find(b => b.id === id)?.status
    store.updateBookingStatus(id, 'approved')
    try {
      await bookingService.approve(id)
    } catch {
      if (prev) store.updateBookingStatus(id, prev)
      throw new Error('Falha ao aprovar.')
    }
  }

  async function deny(id: number | string) {
    store.removeBooking(id)
    try {
      await bookingService.deny(id)
    } catch {
      await fetchMyBookings()
      throw new Error('Falha ao recusar.')
    }
  }

  onMounted(() => {
    fetchMyBookings()
    fetchUnassigned()
  })

  return { store, fetchMyBookings, fetchUnassigned, approve, deny }
}
