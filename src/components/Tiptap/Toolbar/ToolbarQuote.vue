<script setup lang="ts">
import type { Editor } from '@tiptap/core'
import type { Ref } from 'vue'
import { Quote } from 'lucide-vue-next'

import { ToolbarButton } from 'reka-ui'

import { inject } from 'vue'
import { useI18n } from 'vue-i18n'

import Tooltip from '@/components/Shared/Tooltip.vue'

const editor = inject('content') as Ref<Editor>
const { t } = useI18n()
</script>

<template>
  <Tooltip :name="t('toolbar.quote')" side="bottom">
    <ToolbarButton
      :class="{ 'is-active': editor.isActive('blockquote') }"
      class="interactive"
      :value="t('toolbar.quote')"
      @click="editor.chain().focus().toggleBlockquote().run()"
    >
      <Quote />
      <span class="sr-only">{{ t("toolbar.quote") }}</span>
    </ToolbarButton>
  </Tooltip>
</template>
