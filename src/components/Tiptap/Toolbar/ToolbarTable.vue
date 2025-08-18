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
  <div class="gap-1  w-full grid border border-secondary p-1">
    <div class="grid grid-cols-2 w-full gap-2">
      <p class="text-left pl-2 flex justify-start items-center w-full text-xs">
        <span>Table</span>
      </p>
      <div
        class="flex justify-end items-center"
        :class="editor.can().deleteTable() ? 'grid-cols-2' : ''"
      >
        <ToolbarButton
          class="cursor-default flex items-center @xs:min-w-24! border border-secondary px-2 justify-center h-7 gap-2 outline-hidden focus-visible:border-primary focus-visible:border-dashed hover:border-2 text-xs! hover:border-primary"
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
          v-if="editor.can().deleteTable()"
          class="cursor-default flex items-center @xs:min-w-24! border border-secondary px-2 justify-center h-7 gap-2 outline-hidden focus-visible:border-primary focus-visible:border-dashed hover:border-2 hover:border-primary text-xs! "
          :class="
            editor.can().deleteTable() ? '' : 'opacity-30 pointer-events-none'
          "
          @click="editor.chain().focus().deleteTable().run()"
        >
          <span class="sr-only">{{ t("toolbar.deleteTable") }}</span>
          <Minus class="size-4" />
          <span class="@xs:inline-flex hidden">Delete</span>
        </ToolbarButton>
      </div>
    </div>
    <div
      class="grid bg-background pt-2 -mx-1 grid-cols-3"
      :class="editor.can().deleteTable() ? '' : 'hidden'"
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
          class="interactive "
          :disabled="!editor.can().addColumnBefore()"
          @click="editor.chain().focus().addColumnBefore().run()"
        >
          <Plus class="size-6" />
          <span class="sr-only">{{ t("toolbar.addColumnBefore") }}</span>
        </ToolbarButton>
      </div>
      <div
        class="grid bg-secondary grid-cols-3 gap-0.5 p-0.5 justify-center items-center"
      >
        <div class="bg-background min-h-8 w-full" />
        <div class="bg-background min-h-8 w-full" />
        <div class="bg-background min-h-8 w-full" />
        <div class="bg-background min-h-8 w-full" />
        <div class="bg-background min-h-8 w-full" />
        <div class="bg-background min-h-8 w-full" />
        <div class="bg-background min-h-8 w-full" />
        <div class="bg-background min-h-8 w-full" />
        <div class="bg-background min-h-8 w-full" />
      </div>
      <div class="flex justify-start items-center">
        <ToolbarButton
          class="interactive "
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
          class="interactive "
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
      :class="editor.can().deleteTable() ? '' : 'hidden'"
      class="bg-secondary grid-cols-2 border border-secondary w-full mt-2 gap-px grid"
    >
      <ToolbarButton
        class="cursor-default bg-background text-pretty px-1 py-2 outline-hidden focus-visible:border-primary focus-visible:border-dashed border-2 border-transparent hover:border-primary text-center"
        :disabled="!editor.can().mergeCells()"
        @click="editor.chain().focus().mergeCells().run()"
      >
        {{ t("toolbar.mergeCells") }}
      </ToolbarButton>
      <ToolbarButton
        class="cursor-default bg-background text-pretty px-1 py-2 outline-hidden focus-visible:border-primary focus-visible:border-dashed border-2 border-transparent hover:border-primary text-center"
        :disabled="!editor.can().splitCell()"
        @click="editor.chain().focus().splitCell().run()"
      >
        {{ t("toolbar.splitCell") }}
      </ToolbarButton>

      <ToolbarButton
        class="cursor-default bg-background text-pretty px-1 py-2 outline-hidden focus-visible:border-primary focus-visible:border-dashed border-2 border-transparent hover:border-primary text-center"
        :disabled="!editor.can().deleteColumn()"
        @click="editor.chain().focus().deleteColumn().run()"
      >
        {{ t("toolbar.deleteColumn") }}
      </ToolbarButton>
      <ToolbarButton
        class="cursor-default bg-background text-pretty px-1 py-2 outline-hidden focus-visible:border-primary focus-visible:border-dashed border-2 border-transparent hover:border-primary text-center"
        :disabled="!editor.can().deleteRow()"
        @click="editor.chain().focus().deleteRow().run()"
      >
        {{ t("toolbar.deleteRow") }}
      </ToolbarButton>
      <ToolbarButton
        class="cursor-default bg-background text-pretty px-1 py-2 outline-hidden focus-visible:border-primary focus-visible:border-dashed border-2 border-transparent hover:border-primary text-center"
        :disabled="!editor.can().toggleHeaderColumn()"
        @click="editor.chain().focus().toggleHeaderColumn().run()"
      >
        Header column
      </ToolbarButton>
      <ToolbarButton
        class="cursor-default bg-background text-pretty px-1 py-2 outline-hidden focus-visible:border-primary focus-visible:border-dashed border-2 border-transparent hover:border-primary text-center"
        :disabled="!editor.can().toggleHeaderRow()"
        @click="editor.chain().focus().toggleHeaderRow().run()"
      >
        Header row
      </ToolbarButton>
      <ToolbarButton
        class="cursor-default bg-background text-pretty px-1 py-2 outline-hidden focus-visible:border-primary focus-visible:border-dashed border-2 border-transparent hover:border-primary text-center"
        :disabled="!editor.can().toggleHeaderCell()"
        @click="editor.chain().focus().toggleHeaderCell().run()"
      >
        Header cell
      </ToolbarButton>
    </div>
  </div>
</template>
