<script setup lang="ts">
import type { Editor } from '@tiptap/core'
import type { Ref } from 'vue'

import { SquareCheck } from 'lucide-vue-next'
import { ToolbarButton } from 'reka-ui'
import { inject } from 'vue'
import { useI18n } from 'vue-i18n'

import Tooltip from '@/components/Shared/Tooltip.vue'

const editor = inject('content') as Ref<Editor>

const { t } = useI18n()
</script>

<template>
  <Tooltip :name="t('toolbar.addTask')" shortcut="Ctrl Shift Alt L" side="bottom">
    <ToolbarButton
      class="flex interactive items-center justify-center border outline-hidden size-8 focus-visible:border-primary border-secondary"
      :value="t('toolbar.addTask')"
      @click="editor.chain().focus().toggleTaskList().run()"
    >
      <SquareCheck class="size-4" />
      <span class="sr-only">{{ t("toolbar.addTask") }}</span>
    </ToolbarButton>
  </Tooltip>
</template>
