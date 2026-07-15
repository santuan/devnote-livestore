<script setup lang="ts">
import { List, ListOrdered } from 'lucide-vue-next'
import { ToolbarButton } from 'reka-ui'
import { useI18n } from 'vue-i18n'
import Tooltip from '@/components/UI/Tooltip.vue'
import { useEditor } from '@/composables/useEditor'

const { editorRef: editor } = useEditor()

const { t } = useI18n()
</script>

<template>
  <Tooltip :name="t('toolbar.bulletList')" shortcut="Ctrl Shift 8" side="bottom">
    <ToolbarButton
      :class="{ 'is-active': editor.isActive('bulletList') }"
      class="interactive"
      :value="t('toolbar.bulletList')"
      @click="editor.chain().focus().toggleBulletList().run()"
    >
      <List class="size-5!" />
      <span class="sr-only">{{ t("toolbar.bulletList") }}</span>
    </ToolbarButton>
  </Tooltip>
  <Tooltip :name="t('toolbar.orderedList')" shortcut="Ctrl Shift 7" side="bottom">
    <ToolbarButton
      :class="{ 'is-active': editor.isActive('orderedList') }"
      class="interactive"
      :value="t('toolbar.orderedList')"
      @click="editor.chain().focus().toggleOrderedList().run()"
    >
      <ListOrdered class="size-5!" />
      <span class="sr-only">{{ t("toolbar.orderedList") }}</span>
    </ToolbarButton>
  </Tooltip>
</template>
