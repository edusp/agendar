<template>
  <div class="min-h-screen bg-base-100">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { usePushNotifications } from '@/composables/usePushNotifications'

const { init } = usePushNotifications()

onMounted(() => {
  init()
})
</script>

<style scoped></style>
