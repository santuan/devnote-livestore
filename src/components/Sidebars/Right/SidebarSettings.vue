<script setup lang="ts">
import { useStorage } from '@vueuse/core'
import { ChevronRight } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { useClientDocument } from 'vue-livestore'
import { tables } from '@/livestore/schema'
import LayoutPresetGrid from './LayoutPresetGrid.vue'

const emit = defineEmits<{
  (e: 'collapseSecondarySidebar'): void
  (e: 'toggleEditable'): void
  (e: 'focusModeOn'): void
}>()

const { t } = useI18n()
const { editable } = useClientDocument(tables.uiState)

const showLayouts = useStorage('show_layouts', true)
const showPerspective = useStorage('show_perspective', true)
</script>

<template>
  <div class="bg-background">
    <button
      class="flex pl-1 pr-2 w-full h-8 text-left items-center justify-start gap-2"
      @click="showPerspective = !showPerspective"
    >
      <ChevronRight
        class="text-foreground size-3 duration-300 transition-transform"
        :class="showPerspective ? 'rotate-90' : ''"
      />
      <span class="font-semibold text-primary">
        {{ t("settings.perspective") }}
      </span>
    </button>
    <div
      v-show="showPerspective"
      class="bg-background p-2  pb-4 gap-1 grid grid-cols-1 @xs:grid-cols-3"
    >
      <button
        class="flex gap-2 items-center p-1 justify-center w-full"
        :class="
          editable
            ? 'bg-primary text-primary-foreground border-primary'
            : 'bg-secondary/80'
        "
        @click="emit('toggleEditable')"
      >
        <span>{{ t("verb.edit") }}</span>
      </button>
      <button
        class="flex gap-2 items-center p-1 justify-center text-center w-full bg-secondary/80"
        @click="emit('focusModeOn')"
      >
        <span>Focus</span>
      </button>
    </div>
  </div>
  <div class="bg-background">
    <button
      class="flex pl-1 pr-2 w-full h-8 text-left items-center justify-start gap-2"
      @click="showLayouts = !showLayouts"
    >
      <ChevronRight
        class="text-foreground size-3 duration-300 transition-transform"
        :class="showLayouts ? 'rotate-90' : ''"
      />
      <span class="font-semibold text-primary">
        Layout
      </span>
    </button>
    <div v-show="showLayouts" class="mt-1 pr-2 pb-4">
      <LayoutPresetGrid />
    </div>
  </div>
</template>
