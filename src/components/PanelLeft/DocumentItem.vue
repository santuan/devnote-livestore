<script setup lang="ts">
import type { Ref } from 'vue'

// import type { Document } from '@/livestore/document'
import { Circle, CircleOff } from 'lucide-vue-next'
import { inject } from 'vue'
import ButtonDeleteDocument from '@/components/Shared/ButtonDeleteDocument.vue'

const props = defineProps<{
  id: string
  text?: string
  completed?: boolean
}>()

const emit = defineEmits<{
  (e: 'edit', id: string): void
  (e: 'toggle', id: string): void
}>()

const editable_id = inject('editable_id') as Ref<string | null>
</script>

<template>
  <div
    class="border-b border-secondary w-full flex justify-between group"
  >
    <div class="w-full flex flex-row">
      <button
        class="w-full px-3"
        :class="props.id === editable_id ? 'text-primary font-bold underline underline-offset-2' : ''"
        @click="emit('edit', props.id)"
      >
        <span class="line-clamp-1 w-full text-left text-sm overflow-y-hidden">
          {{ props.text?.length === 0 ? "---" : props.text }}
        </span>
      </button>
      <div
        class="flex gap-1 bg-secondary gap-x-px pl-px justify-end"
      >
        <div class="group-hover:inline-flex group-focus-within:inline-flex hidden" :class="props.id === editable_id ? 'inline-flex' : ''">
          <ButtonDeleteDocument :id="props.id" :title="props.text" />
        </div>
        <button
          class="px-3 bg-background border-secondary h-8"
          @click="emit('toggle', props.id)"
        >
          <Circle v-if="!props.completed" class="size-4" />
          <CircleOff v-else class="size-4" />
        </button>
      </div>
    </div>
  </div>
</template>
