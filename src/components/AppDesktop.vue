<script setup lang="ts">
import { queryDb } from '@livestore/livestore'
import {
  breakpointsTailwind,
  useBreakpoints,
  useMagicKeys,
  useStorage,
  whenever,
} from '@vueuse/core'
import { Eye, PanelRightOpen } from 'lucide-vue-next'
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'reka-ui'
import {
  computed,
  onMounted,
  provide,
  shallowRef,
  watch,
  watchEffect,
} from 'vue'
import { useI18n } from 'vue-i18n'
import { useClientDocument, useQuery, useStore } from 'vue-livestore'
import DocumentItem from '@/components/PanelLeft/DocumentItem.vue'
import DocumentList from '@/components/PanelLeft/DocumentList.vue'
import SidebarSecondary from '@/components/PanelRight/index.vue'
import ButtonLogo from '@/components/Shared/ButtonLogo.vue'
import ButtonNewDocument from '@/components/Shared/ButtonNewDocument.vue'
import DialogCommandMenu from '@/components/Shared/DialogCommandMenu.vue'
import Editor from '@/components/Tiptap/EditorTipTap.vue'
import { useToggleColorTheme } from '@/composables/useToggleColorTheme'
import { events, tables } from '@/livestore/schema'

const colorTheme = useStorage('theme', 'theme-foreground')

const breakpoints = useBreakpoints(breakpointsTailwind)
const largerThanLg = breakpoints.greater('lg')

const { t } = useI18n()

const editable_id = shallowRef('')
const editor_content = shallowRef()
const editor_toc = shallowRef([])

provide('content', editor_content)
provide('toc', editor_toc)
provide('editable_id', editable_id)

const input_title = shallowRef<HTMLElement | null>(null)
const focus_logo = shallowRef<HTMLElement | null>(null)
const focus_mode = shallowRef(false)
const sidebar_documents_splitter_ref = shallowRef()
const sidebar_secondary_splitter_ref = shallowRef()
const resize = shallowRef(0)
const layout = shallowRef<number[]>([0, 0])

const { store } = useStore()
const uiState$ = queryDb(tables.uiState.get(), { label: 'uiState' })

const { newDocumentTitle, newDocumentContent, showDocuments, editable } = useClientDocument(tables.uiState)

const isEditing = computed(() => editable_id.value.length === 0)

const visibleDocuments$ = queryDb(
  (get) => {
    const filter = get(uiState$).filter
    return tables.documents.where({
      deletedAt: null,
      completed: filter === 'all' ? undefined : filter === 'completed',
    })
  },
  { label: 'visibleDocuments' },
)

const documents = useQuery(visibleDocuments$)
const documents_count = computed(() => documents.value.length)

function toggle_editable() {
  editor_content.value?.setEditable(!editable.value)
  editable.value = editor_content.value?.options?.editable
}

function hide_panel_left() {
  showDocuments.value = false
}

function createDocument() {
  const id = crypto.randomUUID()
  store.commit(
    events.documentCreated({
      id,
      text: newDocumentTitle.value,
      content: newDocumentContent.value,
    }),
  )
  editable_id.value = id
}

function resetStore() {
  newDocumentTitle.value = ''
  newDocumentContent.value = ''
  editable_id.value = ''
  editable.value = true
}

function editDocument(id: string) {
  if (!id)
    return
  const foundTodo = documents.value.find(todo => todo.id === id)
  if (!foundTodo)
    return
  newDocumentTitle.value = foundTodo.text
  newDocumentContent.value = foundTodo.content
  editable_id.value = id
  if (!largerThanLg.value) {
    showDocuments.value = false
  }
}

function updateDocument() {
  store.commit(
    events.documentUpdated({
      id: editable_id.value,
      text: newDocumentTitle.value,
      content: newDocumentContent.value,
    }),
  )
}

function toggleCompleted(id: string) {
  if (documents.value.find(item => item.id === id)?.completed) {
    store.commit(events.documentUncompleted({ id }))
  }
  else {
    store.commit(events.documentCompleted({ id }))
  }
}

function auto_save() {
  if (!editable_id.value)
    return
  if (newDocumentContent.value === '')
    return
  updateDocument()
}

watchEffect(() => {
  if (newDocumentContent.value)
    auto_save()
})

function toggle_documents() {
  showDocuments.value = !showDocuments.value
  if (focus_mode.value === true) {
    focus_mode.value = false
  }
}

watch(
  () => showDocuments.value,
  (showSidebar) => {
    if (!showSidebar) {
      sidebar_documents_splitter_ref.value?.collapse()
    }
    else {
      if (sidebar_documents_splitter_ref.value.isCollapsed) {
        sidebar_documents_splitter_ref.value.resize(25)
      }
    }
  },
)

watch(
  () => resize.value,
  (resize) => {
    if (!resize)
      return
    if (resize >= 10) {
      showDocuments.value = true
      return true
    }
    if (resize <= 9) {
      showDocuments.value = false
      return true
    }
    return false
  },
  { immediate: true },
)

function focusModeOff() {
  focus_mode.value = false
  if (sidebar_secondary_splitter_ref.value.isCollapsed) {
    sidebar_secondary_splitter_ref.value.expand()
  }
}

function focusModeOn() {
  focus_mode.value = true
}

function collapseSecondarySidebar() {
  if (!sidebar_secondary_splitter_ref.value)
    return
  sidebar_secondary_splitter_ref.value.collapse()
}

function expandSecondarySidebar() {
  if (!sidebar_secondary_splitter_ref.value)
    return
  sidebar_secondary_splitter_ref.value.expand()
}

const keys = useMagicKeys()

const magic_disabled_focus_mode = keys['ctrl+alt+shift+f']
whenever(magic_disabled_focus_mode, (n) => {
  if (n === true) {
    focus_mode.value = !focus_mode.value
  }
})

const magic_show_documents = keys['ctrl+m']
whenever(magic_show_documents, (n) => {
  if (n === true) {
    toggle_documents()
  }
})

const magic_toggle_editable = keys['ctrl+alt+shift+p']
whenever(magic_toggle_editable, (n) => {
  if (n === true) {
    toggle_editable()
  }
})

const magic_reset_store = keys['ctrl+alt+shift+n']
whenever(magic_reset_store, (n) => {
  if (n === true) {
    resetStore()
  }
})

const magic_input_title = keys['ctrl+alt+shift+t']
whenever(magic_input_title, (n) => {
  if (n === true) {
    if (input_title.value instanceof HTMLElement) {
      input_title.value.focus()
    }
  }
})

const magic_focus_editor = keys['ctrl+alt+shift+u']
whenever(magic_focus_editor, (n) => {
  if (n === true) {
    editor_content.value.commands.focus()
  }
})

const magic_focus_logo = keys['ctrl+alt+shift+ArrowLeft']
whenever(magic_focus_logo, (n) => {
  if (n === true) {
    if (sidebar_documents_splitter_ref.value.isCollapsed) {
      sidebar_documents_splitter_ref.value.expand()
      if (focus_logo.value instanceof HTMLElement) {
        focus_logo.value.focus()
      }
    }
    else {
      sidebar_documents_splitter_ref.value.collapse()
      if (focus_logo.value instanceof HTMLElement) {
        focus_logo.value.focus()
      }
    }
  }
})
const magic_collapse_secondary_sidebar = keys['ctrl+alt+shift+ArrowRight']
whenever(magic_collapse_secondary_sidebar, (n) => {
  if (n === true) {
    if (sidebar_secondary_splitter_ref.value.isCollapsed) {
      expandSecondarySidebar()
    }
    else {
      collapseSecondarySidebar()
    }
  }
})

onMounted(() => {
  resetStore()
  useToggleColorTheme(colorTheme.value)
})
</script>

<template>
  <div class="font-mono text-foreground">
    <div v-show="!focus_mode">
      <DialogCommandMenu />
    </div>
    <div v-if="editable" class="fixed bottom-0 right-0">
      <ButtonNewDocument :is-editing @click="resetStore" />
    </div>
    <SplitterGroup
      id="splitter-group-1"
      direction="horizontal"
      auto-save-id="app-desktop"
      @layout="layout = $event"
    >
      <SplitterPanel
        id="splitter-group-1-panel-1"
        ref="sidebar_documents_splitter_ref"
        :min-size="15"
        :max-size="30"
        collapsible
        :collapsed-size="5"
        class="min-w-8 items-start justify-start h-screen bg-background"
        :class="[
          showDocuments
            ? 'fixed md:relative min-w-80 md:min-w-auto  flex z-[71]'
            : 'hidden lg:flex',
          sidebar_documents_splitter_ref?.isCollapsed ? 'max-w-8!' : '',
          resize === 10 ? ' border-r-2! border-primary!' : '',
        ]"
        @resize="resize = $event"
      >
        <ButtonLogo
          v-show="!focus_mode"
          ref="focus_logo"
          @click="toggle_documents"
        />
        <div
          v-show="!sidebar_documents_splitter_ref?.isCollapsed"
          class="w-full duration-300 transition-opacity bg-background"
          :class="[
            showDocuments ? 'relative z-[71]' : '',
            focus_mode ? 'opacity-0 pointer-events-none' : '',
          ]"
        >
          <DocumentList
            :count="documents_count"
          >
            <DocumentItem
              v-for="item in documents"
              :id="item?.id"
              :key="item.id"
              :completed="item?.completed"
              :text="item?.text"
              @edit="editDocument"
              @toggle="toggleCompleted"
            />
          </DocumentList>
        </div>
        <button v-if="showDocuments" class="fixed inset-0 z-[70] bg-background/80 !outline-0 md:hidden" @click="hide_panel_left" />
      </SplitterPanel>
      <SplitterResizeHandle
        id="splitter-group-1-resize-handle-1"
        class="resize-handle hidden md:flex"
      />
      <SplitterPanel
        id="splitter-group-1-panel-2"
        class="min-w-1"
        :min-size="20"
        :class="editable ? 'bg-secondary/20' : ''"
      >
        <div class="relative px-2 flex flex-col gap-2 h-screen">
          <input
            v-if="editable"
            ref="input_title"
            v-model="newDocumentTitle"
            :placeholder="t('editor.untitled')"
            type="text"
            class="border border-primary rounded-none! outline-0 px-2 py-1 w-full"
            @keyup.enter="createDocument"
          >

          <Editor
            :key="newDocumentTitle"
            v-model="newDocumentContent"
            :editor="editor_content"
          />
          <button
            v-show="isEditing"
            v-if="editable"
            class="bg-primary h-12 text-primary-foreground py-2"
            @click="createDocument"
          >
            {{ t("editor.save") }}
          </button>
        </div>
      </SplitterPanel>
      <SplitterResizeHandle
        id="splitter-group-1-resize-handle-2"
        class="resize-handle"
      />
      <SplitterPanel
        id="splitter-group-1-panel-3"
        ref="sidebar_secondary_splitter_ref"
        class="min-w-8 @container"
        :min-size="15"
        :max-size="30"
        collapsible
        :collapsed-size="0"
      >
        <button
          v-if="focus_mode"
          class="size-8 fixed top-0 right-0 z-10 flex justify-center items-center"
          @click="focusModeOff()"
        >
          <Eye class="size-4 pointer-events-none" />
        </button>
        <button
          v-if="!focus_mode"
          v-show="layout[2] === 0"
          class="size-8 fixed right-0 top-0 flex justify-center items-center"
          @click="expandSecondarySidebar()"
        >
          <PanelRightOpen class="size-5 pointer-events-none" />
        </button>
        <SidebarSecondary
          v-if="layout[2] !== 0"
          :focus-mode="focus_mode"
          @collapse-secondary-sidebar="collapseSecondarySidebar"
          @focus-mode-on="focusModeOn"
          @toggle-editable="toggle_editable"
        />
      </SplitterPanel>
    </SplitterGroup>
  </div>
</template>
