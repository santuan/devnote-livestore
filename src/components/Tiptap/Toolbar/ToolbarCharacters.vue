<script setup lang="ts">
import type { Editor } from '@tiptap/core'

import type { Ref } from 'vue'

import { Bold, Italic, Strikethrough } from 'lucide-vue-next'
import { ToolbarButton } from 'reka-ui'
import { inject } from 'vue'
import { useI18n } from 'vue-i18n'
import Tooltip from '@/components/Shared/Tooltip.vue'

const editor = inject('content') as Ref<Editor>

const { t } = useI18n()
</script>

<template>
  <Tooltip :name="t('toolbar.bold')" shortcut="Ctrl B" side="bottom">
    <ToolbarButton
      :disabled="!editor.can().chain().focus().toggleBold().run()"
      :class="{ 'is-active': editor.isActive('bold') }"
      class="interactive "
      :value="t('toolbar.bold')"
      @click="editor.chain().focus().toggleBold().run()"
    >
      <Bold />
      <span class="sr-only">{{ t("toolbar.bold") }}</span>
    </ToolbarButton>
  </Tooltip>
  <Tooltip :name="t('toolbar.italic')" shortcut="Ctrl I" side="bottom">
    <ToolbarButton
      :disabled="!editor.can().chain().focus().toggleItalic().run()"
      :class="{ 'is-active': editor.isActive('italic') }"
      class="interactive "
      :value="t('toolbar.italic')"
      @click="editor.chain().focus().toggleItalic().run()"
    >
      <Italic />
      <span class="sr-only">{{ t("toolbar.italic") }}</span>
    </ToolbarButton>
  </Tooltip>
  <Tooltip :name="t('toolbar.strike')" shortcut="Ctrl Shift S" side="bottom">
    <ToolbarButton
      :disabled="!editor.can().chain().focus().toggleStrike().run()"
      :class="{ 'is-active': editor.isActive('strike') }"
      class="interactive"
      :value="t('toolbar.strike')"
      @click="editor.chain().focus().toggleStrike().run()"
    >
      <Strikethrough />
      <span class="sr-only">{{ t("toolbar.strike") }}</span>
    </ToolbarButton>
  </Tooltip>
</template>
