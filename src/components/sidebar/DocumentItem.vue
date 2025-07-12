<script setup lang="ts">
import type { Ref } from 'vue'
import type { Document } from '@/livestore/document'

import { Circle, CircleOff } from 'lucide-vue-next'
import { inject } from 'vue'
import ButtonDeleteDocument from '../ButtonDeleteDocument.vue'

const props = defineProps<{
  data: Document
}>()

const emit = defineEmits<{
  (e: 'edit', id: string): void
  (e: 'toggle', id: string): void
}>()

const editable_id = inject('editable_id') as Ref<string | null>
</script>

<template>
  <div
    class="border-b border-gray-800 w-full flex justify-between"
  >
    <div class="view-mode w-full flex gap-1 flex-col sm:flex-row">
      <button
        class="w-full px-3"
        :class="props.data.id === editable_id ? 'text-primary font-bold' : ''"
        @click="emit('edit', props.data.id)"
      >
        <span class="line-clamp-1 w-full text-left text-sm overflow-y-hidden">
          {{ props.data.text.length === 0 ? "---" : props.data.text }}
        </span>
      </button>
      <div
        class="flex gap-1 props.datas-center bg-secondary gap-x-px pl-px justify-end"
      >
        <button
          class="px-3 bg-background border-secondary h-8"
          @click="emit('toggle', props.data.id)"
        >
          <Circle v-if="!props.data.completed" class="size-4" />
          <CircleOff v-else class="size-4" />
        </button>
        <ButtonDeleteDocument :id="props.data.id" :title="props.data.text" />
      </div>
    </div>
  </div>
</template>
