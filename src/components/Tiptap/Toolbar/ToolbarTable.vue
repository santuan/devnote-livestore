<script setup lang="ts">
import type { Editor } from '@tiptap/core'
import type { Ref } from 'vue'

import { Grid3x2, Minus, Plus } from 'lucide-vue-next'

import { ToolbarButton } from 'reka-ui'
import { inject } from 'vue'
import { useI18n } from 'vue-i18n'

const editor = inject('content') as Ref<Editor>

const { t } = useI18n()
</script>

<template>
  <div class="gap-1 @xs:grid-cols-4 pb-3  w-full grid border border-secondary p-1">
    <div class="flex pb-2 @xs:col-span-4 justify-between items-center w-full gap-2">
      <p class="text-left justify-start items-center w-full flex text-xs">
        <span>Table</span>
      </p>
      <ToolbarButton
        class="cursor-default flex items-center @xs:min-w-24! border border-secondary px-2 justify-center h-7 gap-2 outline-hidden focus-visible:bg-primary/30 text-xs! hover:bg-primary/24"
        @click="
          editor
            .chain()
            .focus()
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run()
        "
      >
        <span class="sr-only">{{ t("toolbar.insertTable") }}</span>
        <Plus class="size-4" />
        <span class="@xs:inline-flex hidden">Add</span>
      </ToolbarButton>

      <ToolbarButton
        class="cursor-default flex items-center @xs:min-w-24! border border-secondary px-2 justify-center h-7 gap-2 outline-hidden focus-visible:bg-primary/30 text-xs! hover:bg-primary/20"
        :disabled="!editor.can().deleteTable()"
        :class="editor.can().deleteTable() ? '' : 'opacity-30 pointer-events-none'"
        @click="editor.chain().focus().deleteTable().run()"
      >
        <span class="sr-only">{{ t("toolbar.deleteTable") }}</span>
        <Minus class="size-4" />
        <span class="@xs:inline-flex hidden">Delete</span>
      </ToolbarButton>
    </div>
    <div
      class="grid @xs:col-span-2 grid-cols-3"
      :class="editor.can().deleteTable() ? '' : 'opacity-30 pointer-events-none'"
    >
      <div />
      <div class="flex justify-center items-center">
        <ToolbarButton
          class="interactive"
          :disabled="!editor.can().addRowBefore()"
          @click="editor.chain().focus().addRowBefore().run()"
        >
          <Plus class="size-6" />
          <span class="sr-only">{{ t("toolbar.addRowBefore") }}</span>
        </ToolbarButton>
      </div>
      <div />
      <div class="flex justify-end items-center">
        <ToolbarButton
          class="interactive"
          :disabled="!editor.can().addColumnBefore()"
          @click="editor.chain().focus().addColumnBefore().run()"
        >
          <Plus class="size-6" />
          <span class="sr-only">{{ t("toolbar.addColumnBefore") }}</span>
        </ToolbarButton>
      </div>
      <div
        class="flex justify-center h-20 border-1 border-secondary items-center"
      >
        <Grid3x2 class="size-10!" :stroke-width="0.3" />
      </div>
      <div class="flex justify-start items-center">
        <ToolbarButton
          class="interactive"
          :disabled="!editor.can().addColumnAfter()"
          @click="editor.chain().focus().addColumnAfter().run()"
        >
          <Plus class="size-6" />
          <span class="sr-only">{{ t("toolbar.addColumnAfter") }}</span>
        </ToolbarButton>
      </div>
      <div />
      <div class="flex justify-center items-center">
        <ToolbarButton
          class="interactive"
          :disabled="!editor.can().addRowAfter()"
          @click="editor.chain().focus().addRowAfter().run()"
        >
          <Plus class="size-6" />
          <span class="sr-only">{{ t("toolbar.addRowAfter") }}</span>
        </ToolbarButton>
      </div>
      <div />
    </div>
    <div
      :class="editor.can().deleteTable() ? '' : 'opacity-30 pointer-events-none'"
      class="bg-secondary @xs:col-span-2 border border-secondary w-full mt-2 gap-px grid"
    >
      <ToolbarButton
        class="cursor-default bg-background text-pretty px-1 py-2 outline-hidden focus-visible:bg-primary/30 text-center hover:bg-primary/20"
        :disabled="!editor.can().mergeCells()"
        @click="editor.chain().focus().mergeCells().run()"
      >
        {{ t("toolbar.mergeCells") }}
      </ToolbarButton>
      <ToolbarButton
        class="cursor-default bg-background text-pretty px-1 py-2 outline-hidden focus-visible:bg-primary/30 text-center hover:bg-primary/20"
        :disabled="!editor.can().splitCell()"
        @click="editor.chain().focus().splitCell().run()"
      >
        {{ t("toolbar.splitCell") }}
      </ToolbarButton>

      <ToolbarButton
        class="cursor-default bg-background text-pretty px-1 py-2 outline-hidden focus-visible:bg-primary/30 text-center hover:bg-primary/20"
        :disabled="!editor.can().deleteColumn()"
        @click="editor.chain().focus().deleteColumn().run()"
      >
        {{ t("toolbar.deleteColumn") }}
      </ToolbarButton>
      <ToolbarButton
        class="cursor-default bg-background text-pretty px-1 py-2 outline-hidden focus-visible:bg-primary/30 text-center hover:bg-primary/20"
        :disabled="!editor.can().deleteRow()"
        @click="editor.chain().focus().deleteRow().run()"
      >
        {{ t("toolbar.deleteRow") }}
      </ToolbarButton>
    </div>
  </div>
</template>
