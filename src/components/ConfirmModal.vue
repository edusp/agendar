<template>
  <dialog ref="dialogRef" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg">{{ title }}</h3>
      <p class="py-4 text-base-content/70">{{ message }}</p>
      <div class="modal-action">
        <button class="btn btn-ghost" @click="cancel">Cancelar</button>
        <button :class="['btn', confirmClass]" :disabled="loading" @click="confirm">
          <span v-if="loading" class="loading loading-spinner loading-xs"></span>
          {{ confirmLabel }}
        </button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop"><button>fechar</button></form>
  </dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  title: string
  message: string
  confirmLabel?: string
  confirmClass?: string
  loading?: boolean
}>()

const emit = defineEmits<{ confirmed: []; cancelled: [] }>()
const dialogRef = ref<HTMLDialogElement | null>(null)

function open() { dialogRef.value?.showModal() }
function close() { dialogRef.value?.close() }
function confirm() { emit('confirmed'); close() }
function cancel() { emit('cancelled'); close() }

defineExpose({ open, close })
</script>

<style scoped></style>
