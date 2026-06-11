import { PushNotifications } from '@capacitor/push-notifications'
import { Capacitor } from '@capacitor/core'
import { useNotificationsStore } from '@/stores/notifications'
import { notificationService } from '@/services/notificationService'
import { useAuthStore } from '@/stores/auth'

export function usePushNotifications() {
  const notifStore = useNotificationsStore()
  const auth = useAuthStore()

  async function init() {
    if (!Capacitor.isNativePlatform()) return

    let permStatus = await PushNotifications.checkPermissions()
    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions()
    }
    if (permStatus.receive !== 'granted') return

    await PushNotifications.register()

    PushNotifications.addListener('registration', async ({ value: token }) => {
      if (auth.isAuthenticated) {
        const platform = Capacitor.getPlatform() as 'ios' | 'android'
        await notificationService.registerToken(token, platform)
      }
    })

    PushNotifications.addListener('pushNotificationReceived', notification => {
      notifStore.add({
        id: notification.id ?? Date.now().toString(),
        title: notification.title ?? 'Novo agendamento',
        body: notification.body ?? '',
        data: notification.data
      })
    })

    PushNotifications.addListener('pushNotificationActionPerformed', action => {
      const bookingId = action.notification.data?.booking_id
      if (bookingId) {
        window.location.href = `/bookings/${bookingId}`
      }
    })
  }

  return { init }
}
