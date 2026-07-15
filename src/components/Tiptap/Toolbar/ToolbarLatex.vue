<script setup lang="ts">
import { ToolbarButton } from 'reka-ui'
import Tooltip from '@/components/UI/Tooltip.vue'

import { useEditor } from '@/composables/useEditor'

const { editorRef: editor } = useEditor()

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
    <ToolbarButton type="button" class="min-w-24 px-4 border bg-secondary/80 border-secondary h-8 gap-2" title="Insert LaTeX" @click="insertLatex">
      <span class=" text-xs">Add LaTeX</span>
    </ToolbarButton>
  </Tooltip>
</template>
