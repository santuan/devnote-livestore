<script setup lang="ts">
import ButtonLogo from '@/components/UI/ButtonLogo.vue'
import ButtonNewDocument from '@/components/UI/ButtonNewDocument.vue'
import DocumentItem from './DocumentItem.vue'
import DocumentList from './DocumentList.vue'

defineProps<{
  isEditing: boolean
  focusMode: boolean
  showDocuments: boolean
  documents: readonly any[]
  documentsCount: number
  sidebarDocumentsSplitterRef: any
  prefixActive: boolean
}>()

const emit = defineEmits<{
  (e: 'toggleDocuments'): void
  (e: 'hidePanelLeft'): void
  (e: 'createAndFocus'): void
  (e: 'editDocument', id: string): void
  (e: 'toggleCompleted', id: string): void
  (e: 'focusModeOff'): void
  (e: 'focusLogo', el: HTMLElement | null): void
  (e: 'openKeybindings'): void
}>()
</script>

<template>
  <ButtonLogo
    :ref="(el: any) => emit('focusLogo', el?.$el ?? el as HTMLElement | null)"
    :grayscale="prefixActive"
    :show-documents="showDocuments"
    @click="emit('toggleDocuments')"
  />

  <div
    v-show="!sidebarDocumentsSplitterRef?.isCollapsed"
    class="w-full duration-300 border-r border-secondary transition-opacity bg-background"
    :class="[
      showDocuments ? 'relative z-71' : '',
      focusMode ? 'opacity-0 pointer-events-none' : '',
    ]"
  >
    <DocumentList :count="documentsCount" @open="emit('toggleDocuments')" @open-keybindings="emit('openKeybindings')">
      <template #top>
        <ButtonNewDocument :is-editing="isEditing" @click="emit('createAndFocus')" />
      </template>
      <template #list>
        <DocumentItem
          v-for="item in documents"
          :id="item.id"
          :key="item.id"
          :completed="item.completed"
          :text="item.text"
          @edit="emit('editDocument', $event)"
          @toggle="emit('toggleCompleted', $event)"
        />
      </template>
    </DocumentList>
  </div>
  <button
    v-if="showDocuments"
    class="fixed inset-0 z-70 bg-background/80 outline-0! md:hidden"
    @click="emit('hidePanelLeft')"
  />
</template>
