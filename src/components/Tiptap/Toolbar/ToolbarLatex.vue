<script setup lang="ts">
import type { Editor } from '@tiptap/core'
import type { Ref } from 'vue'

import { ToolbarButton } from 'reka-ui'
import { inject } from 'vue'

import Tooltip from '@/components/Shared/Tooltip.vue'

const editor = inject('content') as Ref<Editor>

function insertLatex() {
  if (!editor.value)
    return
  editor.value.commands.insertInlineMath({
    latex: '\\LaTeX',
  })
}
</script>

<template>
  <Tooltip name="Latex" side="bottom">
    <ToolbarButton type="button" class="min-w-24 border border-secondary gap-2" title="Insert LaTeX" @click="insertLatex">
      <span class=" text-xs">Add LaTeX</span>
    </ToolbarButton>
  </Tooltip>
</template>
