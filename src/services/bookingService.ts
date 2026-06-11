import api from './api'

export interface Booking {
  id: number | string
  date: string
  start_time?: string
  time?: string
  status: string
  status_display?: string
  service: string | { name: string; duration_minutes: number }
  staff: string | { id: number; name: string } | null
  client_name?: string
  notes?: string
}

export interface TimeSlot {
  time: string
  available: boolean
}

export const bookingService = {
  async getMyBookings(): Promise<Booking[]> {
    const { data } = await api.get('/booking/api/my/')
    return data.bookings
  },

  async getBookingsByDate(date: string, staffId?: number): Promise<Booking[]> {
    const params: Record<string, unknown> = { date }
    if (staffId) params.staff_id = staffId
    const { data } = await api.get('/booking/api/bookings/', { params })
    return data.bookings
  },

  async getSlots(date: string, staffId?: number): Promise<TimeSlot[]> {
    const params: Record<string, unknown> = { date }
    if (staffId) params.staff_id = staffId
    const { data } = await api.get('/booking/api/slots/', { params })
    return data.slots
  },

  async lockSlot(payload: { date: string; time: string; service_ids: number[]; staff_id: number }) {
    const { data } = await api.post('/booking/api/lock/', payload)
    return data as { lock_id: number; expires_at: string }
  },

  async approve(bookingId: number | string): Promise<void> {
    await api.post(`/booking/api/staff/approve/${bookingId}/`)
  },

  async deny(bookingId: number | string): Promise<void> {
    await api.post(`/booking/api/staff/deny/${bookingId}/`)
  },

  async cancel(bookingId: number | string): Promise<void> {
    await api.post(`/booking/api/cancel/${bookingId}/`)
  },

  async create(payload: Record<string, unknown>) {
    const { data } = await api.post('/booking/api/create/', payload)
    return data as { success: boolean; booking_id: string; message: string }
  },

  async registerPushToken(token: string, platform: 'ios' | 'android') {
    await api.post('/booking/api/barber/push-token/', { token, platform })
  }
}
