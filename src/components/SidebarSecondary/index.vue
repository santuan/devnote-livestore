<script setup lang="ts">
import type { Ref } from 'vue'
import { X } from 'lucide-vue-next'
import { inject } from 'vue'
import ContentAnalysis from './ContentAnalysis.vue'
import DatabaseSettings from './DatabaseSettings.vue'
import SidebarSettings from './SidebarSettings.vue'

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
    class="w-full max-h-screen px-1 font-mono min-h-screen z-10 duration-300 transition-opacity bg-background text-foreground overflow-x-hidden overflow-y-auto"
    :class="props.focusMode ? 'opacity-0 pointer-events-none' : ''"
  >
    <div class="py-1 flex justify-between items-center text-sm gap-1">
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
    <SidebarSettings
      :focus-mode="focusMode"
      @collapse-secondary-sidebar="emit('collapseSecondarySidebar')"
      @focus-mode-on="emit('focusModeOn')"
      @toggle-editable="emit('toggleEditable')"
    />
    <ContentAnalysis />
    <DatabaseSettings />
  </div>
</template>
