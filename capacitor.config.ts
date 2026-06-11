import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.barberhouse.app',
  appName: 'BarberHouse',
  webDir: 'dist',
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    },
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: 'PLACEHOLDER_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
      forceCodeForRefreshToken: true
    }
  }
}

export default config
