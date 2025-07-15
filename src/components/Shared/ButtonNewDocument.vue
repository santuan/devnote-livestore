<script setup lang="ts">
import { Plus } from 'lucide-vue-next'

const props = defineProps<{
  isEditing?: boolean
}>()

const emit = defineEmits<{
  (e: 'click'): void
}>()
</script>

<template>
  <button
    :disabled="props.isEditing"
    class="disabled:bg-secondary disabled:border-secondary hover:bg-primary/80 border-primary border text-xs disabled:pointer-events-none disabled:text-secondary-foreground/20 h-8 w-8 bg-primary text-primary-foreground flex justify-center items-center"
    @click="emit('click')"
  >
    <Plus class="size-4" />
  </button>
</template>
