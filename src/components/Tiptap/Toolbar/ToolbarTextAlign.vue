<script setup lang="ts">
import type { Editor } from '@tiptap/core'

import type { Ref } from 'vue'

import { AlignCenter, AlignJustify, AlignLeft, AlignRight } from 'lucide-vue-next'
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuRoot, DropdownMenuTrigger, ToolbarButton } from 'reka-ui'
import { inject } from 'vue'

import { useI18n } from 'vue-i18n'

import Tooltip from '@/components/Shared/Tooltip.vue'

const editor = inject('content') as Ref<Editor>
const { t } = useI18n()
</script>

<template>
  <DropdownMenuRoot>
    <ToolbarButton as-child>
      <DropdownMenuTrigger class="group">
        <Tooltip :name="t('toolbar.textAlign')" side="bottom">
          <span
            class="flex items-center relative interactive group-data-[state=open]:text-primary justify-center w-full bg-background interactive h-full"
          >
            <template v-if="editor.isActive({ textAlign: 'center' })">
              <AlignCenter class="size-6" />
            </template>
            <template v-else-if="editor.isActive({ textAlign: 'right' })">
              <AlignRight class="size-6" />
            </template>
            <template v-else-if="editor.isActive({ textAlign: 'justify' })">
              <AlignJustify class="size-6" />
            </template>
            <template v-else>
              <AlignLeft class="size-6" />
            </template>
            <span class="sr-only">{{ t("toolbar.textAlign") }}</span>
          </span>
        </Tooltip>
      </DropdownMenuTrigger>
    </ToolbarButton>
    <DropdownMenuPortal>
      <DropdownMenuContent
        align="center"
        side="bottom"
        :side-offset="6"
        class="z-50 grid w-64 text-xs bg-secondary border border-primary"
      >
        <DropdownMenuItem
          class="flex items-center justify-between gap-2 p-2 pr-3 bg-background outline-hidden text-foreground
          font-mono text-xs focus-visible:bg-primary/30 hover:bg-primary/20"
          :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }"
          @click="editor.chain().focus().setTextAlign('left').run()"
        >
          <div class="flex items-center justify-start gap-3 p-1">
            <AlignLeft class="size-4" />
            <span>{{ t("toolbar.alignLeft") }}</span>
          </div>
          <kbd
            class="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded bg-secondary px-1.5 font-mono text-[12px] font-medium text-foreground opacity-100"
          >
            Ctrl Shift L
          </kbd>
        </DropdownMenuItem>
        <DropdownMenuItem
          class="flex items-center justify-between gap-2 p-2 pr-3 bg-background outline-hidden text-foreground
          font-mono text-xs focus-visible:bg-primary/30 hover:bg-primary/20"
          :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }"
          @click="editor.chain().focus().setTextAlign('center').run()"
        >
          <div class="flex items-center justify-start gap-3 p-1">
            <AlignCenter class="size-4" />
            <span>{{ t("toolbar.alignCenter") }}</span>
          </div>
          <kbd
            class="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded bg-secondary px-1.5 font-mono text-[12px] font-medium text-foreground opacity-100"
          >
            Ctrl Shift E
          </kbd>
        </DropdownMenuItem>
        <DropdownMenuItem
          class="flex items-center justify-between gap-2 p-2 pr-3 bg-background outline-hidden text-foreground
          font-mono text-xs focus-visible:bg-primary/30 hover:bg-primary/20"
          :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }"
          @click="editor.chain().focus().setTextAlign('right').run()"
        >
          <div class="flex items-center justify-start gap-3 p-1">
            <AlignRight class="size-4" />
            <span>{{ t("toolbar.alignRight") }}</span>
          </div>
          <kbd
            class="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded bg-secondary px-1.5 font-mono text-[12px] font-medium text-foreground opacity-100"
          >
            Ctrl Shift R
          </kbd>
        </DropdownMenuItem>
        <DropdownMenuItem
          class="flex items-center justify-between gap-2 p-2 pr-3 bg-background outline-hidden text-foreground
          font-mono text-xs focus-visible:bg-primary/30 hover:bg-primary/20"
          :class="{ 'is-active': editor.isActive({ textAlign: 'justify' }) }"
          @click="editor.chain().focus().setTextAlign('justify').run()"
        >
          <div class="flex items-center justify-start gap-3 p-1">
            <AlignJustify class="size-4" />
            <span>{{ t("toolbar.alignJustify") }}</span>
          </div>
          <kbd
            class="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded bg-secondary px-1.5 font-mono text-[12px] font-medium text-foreground opacity-100"
          >
            Ctrl Shift J
          </kbd>
        </DropdownMenuItem>
      <!-- <DropdownMenuItem
        @click="editor.chain().focus().unsetTextAlign().run()"
        class="flex items-center justify-between p-2 pr-3 bg-background outline-hidden focus-visible:bg-primary/30 hover:bg-primary/20"
      >
        <div class="flex items-center justify-start gap-3 p-1">
          <Square class="size-4" />
          <span>{{ t("toolbar.noAlignment") }}</span>
        </div>
        <kbd
          class="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded bg-secondary px-1.5 font-mono text-[12px] font-medium ml-auto text-foreground opacity-100"
        >
          Ctrl Shift L
        </kbd>
      </DropdownMenuItem> -->
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>
