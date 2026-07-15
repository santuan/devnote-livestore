<script setup lang="ts">
import { Code } from 'lucide-vue-next'
import { ToolbarButton } from 'reka-ui'
import { useI18n } from 'vue-i18n'
import Tooltip from '@/components/UI/Tooltip.vue'
import { useEditor } from '@/composables/useEditor'

const { editorRef: editor } = useEditor()
const { t } = useI18n()
</script>

<template>
  <Tooltip :name="t('toolbar.codeBlock')" shortcut="Ctrl Alt C" side="bottom">
    <ToolbarButton
      :class="{ 'is-active': editor.isActive('codeBlock') }"
      class="flex justify-center items-center min-w-20! px-4 border border-secondary bg-secondary/80 h-8 gap-2"
      :value="t('toolbar.codeBlock')"
      @click="editor.chain().focus().toggleCodeBlock().run()"
    >
      <span class="text-xs">
        Code
      </span>
      <Code class="size-4" />
      <span class="sr-only">{{ t("toolbar.codeBlock") }}</span>
    </ToolbarButton>
  </Tooltip>
</template>
