<script setup lang="ts">
import type { Editor } from '@tiptap/core'
import type { Ref } from 'vue'
import { Eraser, RemoveFormatting } from 'lucide-vue-next'

import { ToolbarButton } from 'reka-ui'
import { inject } from 'vue'
import { useI18n } from 'vue-i18n'

import Tooltip from '@/components/Shared/Tooltip.vue'

const editor = inject('content') as Ref<Editor>
const { t } = useI18n()
</script>

<template>
  <Tooltip :name="t('toolbar.unsetAllMarks')" side="bottom">
    <ToolbarButton
      class="interactive"
      :value="t('toolbar.unsetAllMarks')"
      @click="editor.chain().focus().unsetAllMarks().run()"
    >
      <RemoveFormatting />
      <span class="sr-only">{{ t("toolbar.unsetAllMarks") }}</span>
    </ToolbarButton>
  </Tooltip>
  <Tooltip :name="t('toolbar.clearNodes')" side="bottom">
    <ToolbarButton
      class="interactive"
      :value="t('toolbar.clearNodes')"
      @click="editor.chain().focus().clearNodes().run()"
    >
      <Eraser />
      <span class="sr-only">{{ t("toolbar.clearNodes") }}</span>
    </ToolbarButton>
  </Tooltip>
</template>
