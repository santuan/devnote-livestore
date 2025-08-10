<script setup lang="ts">
import type { Editor } from '@tiptap/core'
import type { Ref } from 'vue'
import { ChevronRight } from 'lucide-vue-next'
import { ToolbarRoot, ToolbarToggleGroup } from 'reka-ui'
import { inject, shallowRef } from 'vue'
import { useI18n } from 'vue-i18n'
import ToolbarCharacters from './ToolbarCharacters.vue'
import ToolbarClear from './ToolbarClear.vue'
import ToolbarCodeBlock from './ToolbarCodeBlock.vue'
import ToolbarHeadingSelector from './ToolbarHeadingSelector.vue'
import ToolbarInlineCode from './ToolbarInlineCode.vue'
import ToolbarLatex from './ToolbarLatex.vue'
import ToolbarList from './ToolbarList.vue'
import ToolbarQuote from './ToolbarQuote.vue'
import ToolbarRedo from './ToolbarRedo.vue'
import ToolbarTextSeparator from './ToolbarSeparator.vue'
import ToolbarTable from './ToolbarTable.vue'
import ToolbarTaskList from './ToolbarTaskList.vue'
import ToolbarTextAlign from './ToolbarTextAlign.vue'
import ToolbarUndo from './ToolbarUndo.vue'

const { t } = useI18n()
const editor = inject('content') as Ref<Editor>

const showToolbar = shallowRef(true)
</script>

<template>
  <div class=" z-10 relative bg-background print:hidden">
    <button
      class="flex pl-1 pr-2 w-full h-10 text-left items-center justify-between gap-2"
      @click="showToolbar = !showToolbar"
    >
      <div class="flex items-center justify-start gap-2">
        <ChevronRight
          class="text-foreground size-3 duration-300 transition-transform"
          :class="showToolbar ? 'rotate-90' : ''"
        />
        <span class="text-xs capitalize font-semibold text-primary">
          {{ t("toolbar.toolbar") }}
        </span>
      </div>
    </button>
    <div
      v-if="showToolbar"
      class="relative py-2 px-1 grid w-full max-w-full mx-auto control-group focus-visible:ring-2 focus-visible:ring-primary"
    >
      <ToolbarRoot v-if="editor" class="toolbar">
        <ToolbarToggleGroup class="ToolbarToggleGroup">
          <ToolbarUndo />
          <ToolbarRedo />
          <ToolbarCharacters />
          <ToolbarHeadingSelector />
        </ToolbarToggleGroup>
        <ToolbarToggleGroup class="ToolbarToggleGroup">
          <ToolbarList />
          <ToolbarInlineCode />
          <ToolbarTaskList />
          <ToolbarQuote />
          <ToolbarTextAlign />
          <ToolbarLatex />
          <ToolbarTextSeparator />
          <ToolbarTable />
          <ToolbarClear />
        </ToolbarToggleGroup>
        <ToolbarCodeBlock />
      </ToolbarRoot>
    </div>
  </div>
</template>

<style scoped>
@reference "@/assets/main.css";
.toolbar {
  @apply bg-background grid  gap-y-2  justify-start select-none items-center md:w-auto focus-visible:outline! focus-visible:outline-primary/10! focus-visible:outline-offset-[1.5px]! w-full;
}

.toolbar :deep(button) {
  @apply border border-secondary focus-within:border-primary outline-hidden  text-sm focus-visible:border-primary hover:border-primary! flex justify-center items-center size-8;
  /* @apply @sm:bg-blue-600 @xs:bg-purple-600 @md:bg-yellow-600 @lg:bg-pink-600 @3xl:bg-gray-600 @xl:bg-red-600 @2xl:bg-green-600 @4xl:bg-red-600 @5xl:bg-emerald-600 */
  /* flex: 1; */
}

.control-group :deep(button) {
  @apply disabled:opacity-50 hover:disabled:text-foreground! disabled:pointer-events-none;
}

.toolbar :deep(button.is-active) {
  @apply bg-primary text-primary-foreground;
}

.toolbar :deep(button svg) {
  @apply size-3.5;
}

.ToolbarToggleGroup {
  display: flex;
  flex-wrap: wrap
}

.ToolbarToggleGroup body:has(.cursor_pointer) :deep(label) {
  cursor: pointer;
}
</style>
