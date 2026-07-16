<script setup lang="ts">
import Logo from './Logo.vue'

defineProps<{
  grayscale?: boolean
  showDocuments?: boolean
}>()

const emit = defineEmits<{
  (e: 'click'): void
}>()
</script>

<template>
  <button
    class="fixed z-80 left-0 top-0 flex items-center justify-center p-1 gap-2  max-h-8 focus-visible:ring-1 focus-within:ring-1 focus-within:ring-primary focus-visible:ring-primary"
    :class="grayscale ? 'bg-primary ' : ''"
    @click="emit('click')"
  >
    <Logo :grayscale="grayscale" />
  </button>
</template>
