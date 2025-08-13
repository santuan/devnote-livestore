<script setup lang="ts">
import type { Editor } from '@tiptap/core'
import type { Ref } from 'vue'
import { useStorage } from '@vueuse/core'
import { ChevronRight } from 'lucide-vue-next'
import { ToolbarRoot, ToolbarToggleGroup } from 'reka-ui'
import { inject } from 'vue'
import { useI18n } from 'vue-i18n'
import ToolbarCharacters from './ToolbarCharacters.vue'
import ToolbarClear from './ToolbarClear.vue'
import ToolbarCodeBlock from './ToolbarCodeBlock.vue'
import ToolbarFontsize from './ToolbarFontsize.vue'
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

const showToolbar = useStorage('show_toolbar', true)
</script>

<template>
  <div v-if="editor" class="z-10 relative bg-background print:hidden">
    <button
      class="flex pl-1 pr-2 w-full h-8 text-left items-center justify-between gap-2"
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
      class="relative px-2 w-full pt-2 mx-auto control-group focus-visible:ring-2 focus-visible:ring-primary"
    >
      <ToolbarRoot
        v-if="showToolbar"
        class="toolbar bg-background select-none focus-visible:outline! focus-visible:outline-primary/10! grid gap-3 focus-visible:outline-offset-[1.5px]! w-full"
      >
        <div class="flex gap-2 flex-wrap">
          <ToolbarToggleGroup class="">
            <span>History</span>
            <div class="flex">
              <ToolbarUndo />
              <ToolbarRedo />
            </div>
          </ToolbarToggleGroup>

          <ToolbarToggleGroup class="">
            <span>Format</span>
            <div class="flex flex-wrap">
              <ToolbarCharacters />
              <ToolbarInlineCode />
              <ToolbarQuote />
              <ToolbarClear />
            </div>
          </ToolbarToggleGroup>
        </div>
        <div class="flex gap-2 flex-wrap">
          <ToolbarToggleGroup>
            <span>Heading</span>
            <div class="flex">
              <ToolbarHeadingSelector />
            </div>
          </ToolbarToggleGroup>
          <ToolbarToggleGroup>
            <span>Font size</span>
            <div class="flex">
              <ToolbarFontsize />
            </div>
          </ToolbarToggleGroup>
        </div>
        <div class="flex gap-2 flex-wrap">
          <ToolbarToggleGroup>
            <span>List</span>
            <div class="flex">
              <ToolbarList />
              <ToolbarTaskList />
              <ToolbarTextSeparator />
            </div>
          </ToolbarToggleGroup>
          <ToolbarToggleGroup>
            <span>Text align</span>
            <div class="flex">
              <ToolbarTextAlign />
            </div>
          </ToolbarToggleGroup>
          <ToolbarToggleGroup>
            <span>Component</span>
            <div class="flex gap-1">
              <ToolbarCodeBlock />
              <ToolbarLatex />
            </div>
          </ToolbarToggleGroup>
        </div>

        <ToolbarToggleGroup>
          <ToolbarTable />
        </ToolbarToggleGroup>
      </ToolbarRoot>
    </div>
  </div>
</template>

<style scoped>
@reference "@/assets/main.css";

.toolbar :deep(.interactive) {
  @apply border border-secondary focus-within:border-primary outline-hidden  text-sm focus-visible:border-primary hover:border-primary! flex justify-center items-center size-8;
  /* @apply @sm:bg-blue-600 @xs:bg-purple-600 @md:bg-yellow-600 @lg:bg-pink-600 @3xl:bg-gray-600 @xl:bg-red-600 @2xl:bg-green-600 @4xl:bg-red-600 @5xl:bg-emerald-600 */
  /* flex: 1; */
}

.control-group :deep(.interactive) {
  @apply disabled:opacity-50 hover:disabled:text-foreground! disabled:pointer-events-none;
}

.toolbar :deep(.interactive.is-active) {
  @apply bg-primary text-primary-foreground;
}

.toolbar :deep(.interactive svg) {
  @apply size-3.5;
}

.ToolbarToggleGroup {
  display: flex;
  flex-wrap: wrap;
}

.ToolbarToggleGroup body:has(.cursor_pointer) :deep(label) {
  cursor: pointer;
}
</style>
