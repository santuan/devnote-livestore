<script setup lang="ts">
import type { Editor } from '@tiptap/core'
import type { Ref } from 'vue'
import { Table } from 'lucide-vue-next'

import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuRoot, DropdownMenuSeparator, DropdownMenuTrigger, ToolbarButton } from 'reka-ui'

import { inject } from 'vue'
import { useI18n } from 'vue-i18n'

import Tooltip from '@/components/Shared/Tooltip.vue'

const editor = inject('content') as Ref<Editor>

const { t } = useI18n()
</script>

<template>
  <DropdownMenuRoot>
    <ToolbarButton as-child>
      <DropdownMenuTrigger
        class="group data-[state=open]:text-primary relative"
      >
        <Tooltip
          :name="`${t('toolbar.table')} (experimental)`"
          side="bottom"
          align="end"
          shortcut="Right click on editor"
        >
          <span
            class="flex items-center interactive justify-center outline-hidden interactive size-8 focus-visible:border-primary border-secondary"
          >
            <Table class="size-4 shrink-0" />
          </span>
          <span class="sr-only">{{ t("toolbar.table") }}</span>
        </Tooltip>
      </DropdownMenuTrigger>
    </ToolbarButton>
    <DropdownMenuPortal>
      <DropdownMenuContent
        side="bottom"
        :side-offset="6"
        class="z-10 text-foreground h-40 lg:h-[25rem]  overflow-y-auto scrollbar scrollbar-thumb-primary scrollbar-track-secondary font-mono grid p-1.5 text-xs border w-60 bg-background border-primary"
      >
        <DropdownMenuLabel
          class="cursor-default flex items-center justify-between gap-2 p-2 pr-3 outline-hidden text-xs text-primary"
        >
          {{ t("toolbar.table") }} (experimental)
        </DropdownMenuLabel>
        <DropdownMenuItem
          class="cursor-default flex items-center justify-between gap-2 p-2 pr-3 outline-hidden focus-visible:bg-primary/30 text-xs hover:bg-primary/20"
          @click="
            editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
          "
        >
          {{ t("toolbar.insertTable") }}
        </DropdownMenuItem>
        <DropdownMenuItem
          class="cursor-default flex items-center justify-between gap-2 p-2 pr-3 outline-hidden focus-visible:bg-primary/30 text-xs hover:bg-primary/20"
          :disabled="!editor.can().addColumnBefore()"
          @click="editor.chain().focus().addColumnBefore().run()"
        >
          {{ t("toolbar.addColumnBefore") }}
        </DropdownMenuItem>
        <DropdownMenuItem
          class="cursor-default flex items-center justify-between gap-2 p-2 pr-3 outline-hidden focus-visible:bg-primary/30 text-xs hover:bg-primary/20"
          :disabled="!editor.can().addColumnAfter()"
          @click="editor.chain().focus().addColumnAfter().run()"
        >
          {{ t("toolbar.addColumnAfter") }}
        </DropdownMenuItem>
        <DropdownMenuItem
          class="cursor-default flex items-center justify-between gap-2 p-2 pr-3 outline-hidden focus-visible:bg-primary/30 text-xs hover:bg-primary/20"
          :disabled="!editor.can().deleteColumn()"
          @click="editor.chain().focus().deleteColumn().run()"
        >
          {{ t("toolbar.deleteColumn") }}
        </DropdownMenuItem>
        <DropdownMenuSeparator class="h-[0.0125rem] bg-secondary my-1" />
        <DropdownMenuItem
          class="cursor-default flex items-center justify-between gap-2 p-2 pr-3 outline-hidden focus-visible:bg-primary/30 text-xs hover:bg-primary/20"
          :disabled="!editor.can().addRowBefore()"
          @click="editor.chain().focus().addRowBefore().run()"
        >
          {{ t("toolbar.addRowBefore") }}
        </DropdownMenuItem>
        <DropdownMenuItem
          class="cursor-default flex items-center justify-between gap-2 p-2 pr-3 outline-hidden focus-visible:bg-primary/30 text-xs hover:bg-primary/20"
          :disabled="!editor.can().addRowAfter()"
          @click="editor.chain().focus().addRowAfter().run()"
        >
          {{ t("toolbar.addRowAfter") }}
        </DropdownMenuItem>
        <DropdownMenuItem
          class="cursor-default flex items-center justify-between gap-2 p-2 pr-3 outline-hidden focus-visible:bg-primary/30 text-xs hover:bg-primary/20"
          :disabled="!editor.can().deleteRow()"
          @click="editor.chain().focus().deleteRow().run()"
        >
          {{ t("toolbar.deleteRow") }}
        </DropdownMenuItem>
        <DropdownMenuSeparator class="h-[0.0125rem] bg-secondary my-1" />
        <DropdownMenuItem
          class="cursor-default flex items-center justify-between gap-2 p-2 pr-3 outline-hidden focus-visible:bg-primary/30 text-xs hover:bg-primary/20"
          :disabled="!editor.can().deleteTable()"
          @click="editor.chain().focus().deleteTable().run()"
        >
          {{ t("toolbar.deleteTable") }}
        </DropdownMenuItem>
        <DropdownMenuSeparator class="h-[0.0125rem] bg-secondary my-1" />
        <DropdownMenuItem
          class="cursor-default flex items-center justify-between gap-2 p-2 pr-3 outline-hidden focus-visible:bg-primary/30 text-xs hover:bg-primary/20"
          :disabled="!editor.can().mergeCells()"
          @click="editor.chain().focus().mergeCells().run()"
        >
          {{ t("toolbar.mergeCells") }}
        </DropdownMenuItem>
        <DropdownMenuItem
          class="cursor-default flex items-center justify-between gap-2 p-2 pr-3 outline-hidden focus-visible:bg-primary/30 text-xs hover:bg-primary/20"
          :disabled="!editor.can().splitCell()"
          @click="editor.chain().focus().splitCell().run()"
        >
          {{ t("toolbar.splitCell") }}
        </DropdownMenuItem>
        <!-- <DropdownMenuItem
          @click="editor.chain().focus().fixTables().run()"
          class="cursor-default flex items-center justify-between gap-2 p-2 pr-3 outline-hidden focus-visible:bg-primary/30 text-xs hover:bg-primary/20"
          :disabled="!editor.can().fixTables()"
        >
          Fix Tables
        </DropdownMenuItem> -->
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>
