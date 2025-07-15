<script setup lang="ts">
import Logo from './Logo.vue'

const emit = defineEmits<{
  (e: 'click'): void
}>()
</script>

<template>
  <button
    class="fixed z-[80] left-0 top-0 flex items-center justify-center gap-2 p-1 w-8 max-h-8 focus-visible:ring-1 focus-within:ring-1 focus-within:ring-primary focus-visible:ring-primary"
    @click="emit('click')"
  >
    <Logo />
  </button>
</template>
