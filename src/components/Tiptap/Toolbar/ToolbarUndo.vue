<script setup lang="ts">
import { Undo2 } from 'lucide-vue-next'

import { ToolbarButton } from 'reka-ui'
import { useI18n } from 'vue-i18n'
import Tooltip from '@/components/UI/Tooltip.vue'

import { useEditor } from '@/composables/useEditor'

const { editorRef: editor } = useEditor()

const { t } = useI18n()
</script>

<template>
  <Tooltip :name="t('toolbar.undo')" side="bottom">
    <ToolbarButton
      class="flex interactive items-center justify-center border outline-hidden size-8 focus-visible:border-primary border-secondary"
      :disabled="!editor.can().chain().focus().undo().run()"
      :value="t('toolbar.undo')"
      @click="editor.chain().focus().undo().run()"
    >
      <Undo2 class="size-4" />
      <span class="sr-only">{{ t("toolbar.undo") }}</span>
    </ToolbarButton>
  </Tooltip>
</template>
