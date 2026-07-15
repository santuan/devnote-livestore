<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Editor from '@/components/Tiptap/EditorTipTap.vue'

defineProps<{
  editableId: string
  editable: boolean
  isEditing: boolean
  editorRef: any
}>()

const emit = defineEmits<{
  (e: 'createDocument'): void
}>()

const contentModel = defineModel<any>('content', { required: true })
const titleModel = defineModel<any>('title', { required: true })

const inputTitleRef = ref<HTMLElement | null>(null)
defineExpose({ inputTitleRef })

const { t } = useI18n()
</script>

<template>
  <div class="relative pt-px flex flex-col gap-2 h-screen">
    <Editor
      :key="editableId"
      v-model="contentModel"
      :editor="editorRef"
    >
      <div class="px-4">
        <input
          v-if="editable"
          ref="inputTitleRef"
          v-model="titleModel"
          :placeholder="t('editor.untitled')"
          type="text"
          class="outline -outline-offset-1 mb-0.5 outline-primary bg-background rounded-none! px-5 py-1.75 min-h-11.5 w-full text-2xl"
          @keyup.enter="emit('createDocument')"
        >
      </div>
    </Editor>
    <button
      v-show="isEditing"
      v-if="editable"
      class="bg-primary h-12 text-primary-foreground py-2 absolute left-0 bottom-0 right-0"
      @click="emit('createDocument')"
    >
      {{ t("editor.save") }}
    </button>
  </div>
</template>
