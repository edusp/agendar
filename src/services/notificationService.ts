import api from './api'

export const notificationService = {
  async registerToken(token: string, platform: 'ios' | 'android') {
    return api.post('/booking/api/barber/push-token/', { token, platform })
  }
}
