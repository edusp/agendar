<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />

    <div class="p-4 flex-1">
      <div role="tablist" class="tabs tabs-boxed mb-4">
        <button
          role="tab"
          :class="['tab', activeTab === 'mine' ? 'tab-active' : '']"
          @click="activeTab = 'mine'"
        >
          Meus
          <span v-if="store.myBookings.length" class="badge badge-sm ml-1">{{ store.myBookings.length }}</span>
        </button>
        <button
          role="tab"
          :class="['tab', activeTab === 'unassigned' ? 'tab-active' : '']"
          @click="activeTab = 'unassigned'"
        >
          Sem Barbeiro
          <span v-if="store.unassignedBookings.length" class="badge badge-warning badge-sm ml-1">{{ store.unassignedBookings.length }}</span>
        </button>
      </div>

      <BookingList
        :bookings="activeTab === 'mine' ? store.myBookings : store.unassignedBookings"
        :loading="store.loading"
        :error="store.error"
        @select="goToDetail"
      />
    </div>

    <div class="btm-nav btm-nav-sm">
      <button class="active" @click="fetchAll">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7h18M3 12h18M3 17h18" />
        </svg>
        <span class="btm-nav-label">Agendamentos</span>
      </button>
      <button @click="router.push('/block-slots')">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
        <span class="btm-nav-label">Bloquear</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import BookingList from '@/components/BookingList.vue'
import { useBookings } from '@/composables/useBookings'
import type { Booking } from '@/services/bookingService'

const router = useRouter()
const { store, fetchMyBookings, fetchUnassigned } = useBookings()
const activeTab = ref<'mine' | 'unassigned'>('mine')

function goToDetail(booking: Booking) {
  router.push(`/bookings/${booking.id}`)
}

function fetchAll() {
  fetchMyBookings()
  fetchUnassigned()
}
</script>

<style scoped></style>
