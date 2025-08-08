<script setup lang="ts">
import type { Editor } from '@tiptap/core'
import type { Ref } from 'vue'
import { ChevronDown } from 'lucide-vue-next'

import { DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuRoot, DropdownMenuTrigger, ToolbarButton } from 'reka-ui'
import { inject } from 'vue'
import { useI18n } from 'vue-i18n'

const editor = inject('content') as Ref<Editor>
const { t } = useI18n()
</script>

<template>
  <DropdownMenuRoot>
    <ToolbarButton as-child>
      <DropdownMenuTrigger class="headingSelector interactive">
        <span class="w-32 truncate text-left ">
          <template v-if="editor.isActive('heading', { level: 1 })">
            {{ t("toolbar.heading1") }}
          </template>
          <template v-else-if="editor.isActive('heading', { level: 2 })">
            {{ t("toolbar.heading2") }}
          </template>
          <template v-else-if="editor.isActive('heading', { level: 3 })">
            {{ t("toolbar.heading3") }}
          </template>
          <template v-else-if="editor.isActive('heading', { level: 4 })">
            {{ t("toolbar.heading4") }}
          </template>
          <template v-else-if="editor.isActive('heading', { level: 5 })">
            {{ t("toolbar.heading5") }}
          </template>
          <template v-else-if="editor.isActive('heading', { level: 6 })">
            {{ t("toolbar.heading6") }}
          </template>
          <template v-else>
            {{ t("toolbar.paragraph") }}
          </template>
        </span>
        <ChevronDown class="size-4 shrink-0" />
      </DropdownMenuTrigger>
    </ToolbarButton>
    <DropdownMenuPortal>
      <DropdownMenuContent
        :align="'center'"
        :side="'bottom'"
        :side-offset="0"
        class="z-10 grid text-xs border w-44 bg-background border-primary"
      >
        <DropdownMenuItem
          :class="{ 'is-active': editor.isActive('paragraph') }"
          class="flex items-center justify-between font-mono text-foreground gap-2 p-2 pr-3 cursor-pointer hover:bg-primary/20"
          @click="editor.chain().focus().toggleHeading({ level: 6 }).run()"
        >
          {{ t("toolbar.paragraph") }}
        </DropdownMenuItem>
        <DropdownMenuItem
          :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
          class="flex items-center justify-between font-mono text-foreground gap-2 p-2 pr-3 cursor-pointer hover:bg-primary/20"
          @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
        >
          {{ t("toolbar.heading1") }}
        </DropdownMenuItem>
        <DropdownMenuItem
          :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
          class="flex items-center justify-between font-mono text-foreground gap-2 p-2 pr-3 cursor-pointer hover:bg-primary/20"
          @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        >
          {{ t("toolbar.heading2") }}
        </DropdownMenuItem>
        <DropdownMenuItem
          :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
          class="flex items-center justify-between font-mono text-foreground gap-2 p-2 pr-3 cursor-pointer hover:bg-primary/20"
          @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        >
          {{ t("toolbar.heading3") }}
        </DropdownMenuItem>
        <DropdownMenuItem
          :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }"
          class="flex items-center justify-between font-mono text-foreground gap-2 p-2 pr-3 cursor-pointer hover:bg-primary/20"
          @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
        >
          {{ t("toolbar.heading4") }}
        </DropdownMenuItem>
        <DropdownMenuItem
          :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }"
          class="flex items-center justify-between font-mono text-foreground gap-2 p-2 pr-3 cursor-pointer hover:bg-primary/20"
          @click="editor.chain().focus().toggleHeading({ level: 5 }).run()"
        >
          {{ t("toolbar.heading5") }}
        </DropdownMenuItem>
        <DropdownMenuItem
          :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }"
          class="flex items-center justify-between font-mono text-foreground gap-2 p-2 pr-3 cursor-pointer hover:bg-primary/20"
          @click="editor.chain().focus().toggleHeading({ level: 6 }).run()"
        >
          {{ t("toolbar.heading6") }}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>

<style scoped>
@reference "@/assets/main.css";

.headingSelector {
  /* grid-column: 1 / 8; */
  @apply flex items-center text-xs! truncate justify-between! bg-background px-2;
  @apply min-w-40! max-w-40! w-full hover:z-10;
}
</style>
