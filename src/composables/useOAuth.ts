import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'

export function useOAuth() {
  const authStore = useAuthStore()

  async function loginWithGoogle() {
    try {
      const googleUser = await GoogleAuth.signIn()
      const idToken = googleUser.authentication.idToken

      const { data } = await api.post('/api/auth/google/', { id_token: idToken })

      authStore.setAuth(data.token, {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        staffId: data.user.staff_id
      })

      return { success: true }
    } catch (err) {
      console.error('OAuth error', err)
      return { success: false, error: err }
    }
  }

  async function logout() {
    try { await GoogleAuth.signOut() } catch {}
    authStore.logout()
  }

  return { loginWithGoogle, logout }
}
