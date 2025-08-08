<script setup lang="ts">
import type { Editor } from '@tiptap/core'
import type { Ref } from 'vue'

import { ToolbarButton } from 'reka-ui'
import { inject } from 'vue'
import { useI18n } from 'vue-i18n'
import Tooltip from '@/components/Shared/Tooltip.vue'

const editor = inject('content') as Ref<Editor>
const { t } = useI18n()
</script>

<template>
  <Tooltip :name="t('toolbar.code')" shortcut="Ctrl E" side="bottom">
    <ToolbarButton
      :disabled="!editor.can().chain().focus().toggleCode().run()"
      :class="{ 'is-active': editor.isActive('code') }"
      class="font-mono interactive text-base!"
      :value="t('toolbar.code')"
      @click="editor.chain().focus().toggleCode().run()"
    >
      <span
        class="flex items-center justify-center text-xs rounded size-5 bg-foreground text-background"
      >
        M
      </span>
      <span class="sr-only">{{ t("toolbar.code") }}</span>
    </ToolbarButton>
  </Tooltip>
</template>
