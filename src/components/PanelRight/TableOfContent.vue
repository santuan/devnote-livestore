<script setup lang="ts">
import type { Editor } from '@tiptap/core'
import type { Ref } from 'vue'
import { useStorage } from '@vueuse/core'
import { ChevronRight } from 'lucide-vue-next'
import { inject } from 'vue'
import { useI18n } from 'vue-i18n'
import EditorToc from '../Tiptap/TableOfContents/EditorToc.vue'

const { t } = useI18n()
const editor = inject('content') as Ref<Editor>
const toc = inject('toc') as Ref<any>
const showOnlyHeadings = useStorage('show_only_headings', true)
</script>

<template>
  <div class="w-full text-xs bg-background relative">
    <button
      class="flex pl-1 pr-2 w-full text-xs h-8 text-left items-center justify-between gap-2"
      @click="showOnlyHeadings = !showOnlyHeadings"
    >
      <div class="flex items-center justify-start gap-2">
        <ChevronRight
          class="text-foreground size-3 duration-300 transition-transform"
          :class="[
            showOnlyHeadings ? 'rotate-90' : '',
          ]"
        />
        <span
          class="font-semibold text-primary"
        >
          {{ t("leva.headings") }}
        </span>
      </div>
    </button>
    <EditorToc v-if="showOnlyHeadings" :editor :items="toc" />
  </div>
</template>
