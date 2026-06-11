import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface AppNotification {
  id: string
  title: string
  body: string
  data?: Record<string, unknown>
  read: boolean
  receivedAt: string
}

export const useNotificationsStore = defineStore('notifications', () => {
  const items = ref<AppNotification[]>([])

  function add(n: Omit<AppNotification, 'read' | 'receivedAt'>) {
    items.value.unshift({ ...n, read: false, receivedAt: new Date().toISOString() })
  }

  function markRead(id: string) {
    const n = items.value.find(x => x.id === id)
    if (n) n.read = true
  }

  const unreadCount = () => items.value.filter(x => !x.read).length

  return { items, add, markRead, unreadCount }
})
