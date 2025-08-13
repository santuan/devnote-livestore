<script setup lang="ts">
import type { Editor } from '@tiptap/core'

import type { Ref } from 'vue'

import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
} from 'lucide-vue-next'
import {
  ToolbarButton,
} from 'reka-ui'
import { inject } from 'vue'

// import { useI18n } from 'vue-i18n'
// const { t } = useI18n()

const editor = inject('content') as Ref<Editor>
</script>

<template>
  <div class="flex justify-start items-center w-full bg-background">
    <ToolbarButton
      class="interactive"
      :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }"
      @click="editor.chain().focus().setTextAlign('left').run()"
    >
      <div class="flex items-center justify-center gap-3 p-1">
        <AlignLeft class="size-4" />
        <!-- <span>{{ t("toolbar.alignLeft") }}</span> -->
      </div>
      <!-- <kbd
        class="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded bg-secondary px-1.5 font-mono text-[12px] font-medium text-foreground opacity-100"
      >
        Ctrl Shift L
      </kbd> -->
    </ToolbarButton>
    <ToolbarButton
      class="interactive"
      :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }"
      @click="editor.chain().focus().setTextAlign('center').run()"
    >
      <div class="flex items-center justify-center gap-3 p-1">
        <AlignCenter class="size-4" />
        <!-- <span>{{ t("toolbar.alignCenter") }}</span> -->
      </div>
      <!-- <kbd
        class="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded bg-secondary px-1.5 font-mono text-[12px] font-medium text-foreground opacity-100"
      >
        Ctrl Shift E
      </kbd> -->
    </ToolbarButton>
    <ToolbarButton
      class="interactive"
      :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }"
      @click="editor.chain().focus().setTextAlign('right').run()"
    >
      <div class="flex items-center justify-center gap-3 p-1">
        <AlignRight class="size-4" />
        <!-- <span>{{ t("toolbar.alignRight") }}</span> -->
      </div>
      <!-- <kbd
        class="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded bg-secondary px-1.5 font-mono text-[12px] font-medium text-foreground opacity-100"
      >
        Ctrl Shift R
      </kbd> -->
    </ToolbarButton>
    <ToolbarButton
      class="interactive"
      :class="{ 'is-active': editor.isActive({ textAlign: 'justify' }) }"
      @click="editor.chain().focus().setTextAlign('justify').run()"
    >
      <div class="flex items-center justify-center gap-3 p-1">
        <AlignJustify class="size-4" />
        <!-- <span>{{ t("toolbar.alignJustify") }}</span> -->
      </div>
      <!-- <kbd
        class="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded bg-secondary px-1.5 font-mono text-[12px] font-medium text-foreground opacity-100"
      >
        Ctrl Shift J
      </kbd> -->
    </ToolbarButton>
  </div>
</template>
