<template>
  <div class="navbar bg-base-200 shadow-sm px-4">
    <div class="flex-1">
      <span class="text-xl font-bold">BarberHouse</span>
    </div>
    <div class="flex-none gap-2">
      <div v-if="unread > 0" class="indicator">
        <span class="indicator-item badge badge-error badge-xs">{{ unread }}</span>
        <button class="btn btn-ghost btn-circle">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
      </div>
      <div class="dropdown dropdown-end">
        <label tabindex="0" class="btn btn-ghost btn-circle avatar placeholder">
          <div class="bg-neutral text-neutral-content rounded-full w-8">
            <span class="text-xs">{{ initials }}</span>
          </div>
        </label>
        <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-10 p-2 shadow bg-base-100 rounded-box w-40">
          <li><button @click="handleLogout">Sair</button></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotificationsStore } from '@/stores/notifications'
import { useOAuth } from '@/composables/useOAuth'

const auth = useAuthStore()
const notifStore = useNotificationsStore()
const router = useRouter()
const { logout } = useOAuth()

const initials = computed(() => {
  const name = auth.user?.name ?? ''
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
})

const unread = computed(() => notifStore.unreadCount())

async function handleLogout() {
  await logout()
  router.push('/login')
}
</script>

<style scoped></style>
