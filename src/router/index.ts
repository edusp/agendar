import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LoginView from '@/views/LoginView.vue'
import BookingsView from '@/views/BookingsView.vue'
import BookingDetailView from '@/views/BookingDetailView.vue'
import RescheduleView from '@/views/RescheduleView.vue'
import BlockSlotsView from '@/views/BlockSlotsView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/bookings' },
    { path: '/login', component: LoginView, meta: { public: true } },
    { path: '/bookings', component: BookingsView, meta: { requiresAuth: true } },
    { path: '/bookings/:id', component: BookingDetailView, meta: { requiresAuth: true } },
    { path: '/bookings/:id/reschedule', component: RescheduleView, meta: { requiresAuth: true } },
    { path: '/block-slots', component: BlockSlotsView, meta: { requiresAuth: true } }
  ]
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return '/login'
  }
  if (to.meta.public && auth.isAuthenticated) {
    return '/bookings'
  }
})

export default router
