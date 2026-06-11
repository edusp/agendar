import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface AuthUser {
  id: number
  name: string
  email: string
  staffId: number
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('bearer_token'))
  const user = ref<AuthUser | null>(JSON.parse(localStorage.getItem('user') || 'null'))

  const isAuthenticated = computed(() => !!token.value)

  function setAuth(bearerToken: string, userData: AuthUser) {
    token.value = bearerToken
    user.value = userData
    localStorage.setItem('bearer_token', bearerToken)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('bearer_token')
    localStorage.removeItem('user')
  }

  return { token, user, isAuthenticated, setAuth, logout }
})
