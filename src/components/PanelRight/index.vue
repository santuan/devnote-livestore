<script setup lang="ts">
import type { Ref } from 'vue'
import { X } from 'lucide-vue-next'
import { inject } from 'vue'
import ContentAnalysis from './ContentAnalysis.vue'
import SidebarSettings from './SidebarSettings.vue'
import TableOfContent from './TableOfContent.vue'

const props = defineProps<{
  focusMode: boolean
}>()

const emit = defineEmits<{
  (e: 'collapseSecondarySidebar'): void
  (e: 'toggleEditable'): void
  (e: 'focusModeOn'): void
}>()

const editable_id = inject('editable_id') as Ref<string | null>
</script>

<template>
  <div
    class="w-full max-h-screen text-xs  font-mono z-10 duration-300 transition-opacity bg-background text-foreground overflow-x-hidden overflow-y-auto scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thumb-secondary-foreground scrollbar-track-secondary"
    :class="props.focusMode ? 'opacity-0 pointer-events-none' : ''"
  >
    <div class="p-1 pr-0 flex sticky top-0 right-0 z-10 bg-background justify-between items-center text-xs gap-1">
      <div class="flex justify-start items-center">
        <strong class="font-bold mr-1">ID:</strong>
        <span class="line-clamp-1 text-muted-foreground">
          {{ `${editable_id?.substring(0, 30)}` }}</span>
      </div>
      <div>
        <button
          class="size-8 flex justify-center items-center"
          @click="emit('collapseSecondarySidebar')"
        >
          <X class="size-4 pointer-events-none" />
        </button>
      </div>
    </div>
    <div
      class="p-px max-h-[calc(100vh-2.5rem)] min-h-[calc(100vh-2.5rem)] bg-primary/5 "
    >
      <ContentAnalysis />
      <TableOfContent />
      <SidebarSettings
        @collapse-secondary-sidebar="emit('collapseSecondarySidebar')"
        @focus-mode-on="emit('focusModeOn')"
        @toggle-editable="emit('toggleEditable')"
      />
    </div>
  </div>
</template>
