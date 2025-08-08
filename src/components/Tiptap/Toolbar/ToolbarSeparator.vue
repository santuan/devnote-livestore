<script setup lang="ts">
import type { Editor } from '@tiptap/core'
import type { Ref } from 'vue'

import { Minus } from 'lucide-vue-next'

import { ToolbarButton } from 'reka-ui'
import { inject } from 'vue'
import { useI18n } from 'vue-i18n'

import Tooltip from '@/components/Shared/Tooltip.vue'

const editor = inject('content') as Ref<Editor>

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
