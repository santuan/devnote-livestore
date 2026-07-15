<script setup lang="ts">
import { Minus } from 'lucide-vue-next'

import { ToolbarButton } from 'reka-ui'
import { useI18n } from 'vue-i18n'
import Tooltip from '@/components/UI/Tooltip.vue'

import { useEditor } from '@/composables/useEditor'

const { editorRef: editor } = useEditor()

const { t } = useI18n()
</script>

<template>
  <Tooltip :name="t('toolbar.separator')" side="bottom">
    <ToolbarButton
      class="interactive"
      :value="t('toolbar.separator')"
      @click="editor.chain().focus().setHorizontalRule().run()"
    >
      <Minus />
      <span class="sr-only">{{ t("toolbar.separator") }}</span>
    </ToolbarButton>
  </Tooltip>
</template>
