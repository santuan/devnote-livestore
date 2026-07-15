<script setup lang="ts">
import { ToolbarButton } from 'reka-ui'
import { useI18n } from 'vue-i18n'
import Tooltip from '@/components/UI/Tooltip.vue'
import { useEditor } from '@/composables/useEditor'

const { editorRef: editor } = useEditor()
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
        class="key"
      >
        M
      </span>
      <span class="sr-only">{{ t("toolbar.code") }}</span>
    </ToolbarButton>
  </Tooltip>
</template>

<style scoped>
@reference "@/assets/main.css";

.interactive.is-active {
  @apply bg-red-600;

  .key {
    @apply bg-primary text-primary-foreground
  }
}

.key {
  @apply flex items-center justify-center text-xs  size-5 bg-gray-900/10! text-foreground;
}
</style>
