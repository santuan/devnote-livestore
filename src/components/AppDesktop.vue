<script setup lang="ts">
import { queryDb } from '@livestore/livestore'
import NumberFlow from '@number-flow/vue'
import {
  breakpointsTailwind,
  useBreakpoints,
  useMagicKeys,
  useStorage,
  whenever,
} from '@vueuse/core'
import { X } from 'lucide-vue-next'
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
import Tooltip from '@/components/Tooltip.vue'
import { useToggleColorTheme } from '@/composables/useToggleColorTheme'
import Editor from '../components/Tiptap/EditorTipTap.vue'
import { events, tables } from '../livestore/schema'
import DialogCommandMenu from './DialogCommandMenu.vue'
import DropdownLanguage from './DropdownLanguage.vue'
import Logo from './Logo.vue'
import ContentAnalysis from './sidebar/ContentAnalysis.vue'
import DocumentItem from './sidebar/DocumentItem.vue'
import Filters from './sidebar/Filters.vue'
import ToggleTheme from './ToggleTheme.vue'

const colorTheme = useStorage('theme', 'theme-foreground')

const { t } = useI18n()
const editable_id = shallowRef('')

const focusMode = shallowRef(false)
const editor_content = shallowRef()
const editor_toc = shallowRef([])
const sidebar_splitter_ref = shallowRef()
const resize = shallowRef(0)
const breakpoints = useBreakpoints(breakpointsTailwind)
const largerThanLg = breakpoints.greater('lg')
const layout = shallowRef<number[]>([0, 0])
const { store } = useStore()
const uiState$ = queryDb(tables.uiState.get(), { label: 'uiState' })
const { newDocumentTitle, newDocumentContent, showDocuments, editable }
  = useClientDocument(tables.uiState)

provide('content', editor_content)
provide('toc', editor_toc)
provide('editable_id', editable_id)

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

function toggle_editable() {
  editor_content.value?.setEditable(!editable.value)
  editable.value = editor_content.value?.options?.editable
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
  const foundTodo = documents.value.find(todo => todo.id === id)
  if (foundTodo) {
    newDocumentTitle.value = foundTodo.text
    newDocumentContent.value = foundTodo.content
    editable_id.value = id
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
  if (focusMode.value === true) {
    focusMode.value = false
  }
}

const resizeTo = computed(() => {
  if (largerThanLg.value === true) {
    return 30
  }
  else {
    return 50
  }
})

watch(
  () => showDocuments.value,
  (showSidebar) => {
    if (!showSidebar) {
      sidebar_splitter_ref.value?.collapse()
    }
    else {
      if (sidebar_splitter_ref.value.isCollapsed) {
        sidebar_splitter_ref.value.resize(resizeTo.value)
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

function disabledFocusMode() {
  focusMode.value = !focusMode.value
}

const keys = useMagicKeys()

const magic_disabled_focus_mode = keys['ctrl+alt+shift+f']
whenever(magic_disabled_focus_mode, (n) => {
  if (n === true) {
    disabledFocusMode()
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

onMounted(() => {
  resetStore()
  useToggleColorTheme(colorTheme.value)
})
</script>

<template>
  <div class="font-mono text-foreground">
    <SplitterGroup
      id="splitter-group-1"
      direction="horizontal"
      auto-save-id="app-desktop"
      @layout="layout = $event"
    >
      <SplitterPanel
        id="splitter-group-1-panel-1"
        ref="sidebar_splitter_ref"
        :min-size="15"
        :max-size="50"
        collapsible
        :collapsed-size="5"
        class="min-w-10 items-start justify-start h-screen"
        :class="[
          showDocuments
            ? 'fixed md:relative min-w-80 md:min-w-auto flex z-[71]'
            : 'hidden lg:flex',
          sidebar_splitter_ref?.isCollapsed ? 'max-w-10!' : '',
          resize === 10 ? ' border-r-2! border-primary!' : '',
        ]"
        @resize="resize = $event"
      >
        <button
          v-show="!focusMode"
          class="fixed z-[80] left-0 top-0 flex items-center justify-center gap-2 p-1 w-8 max-h-8 focus-visible:ring-1 focus-within:ring-1 focus-within:ring-primary focus-visible:ring-primary"
          @click="toggle_documents"
        >
          <Logo />
        </button>
        <DialogCommandMenu />
        <div
          v-show="!sidebar_splitter_ref?.isCollapsed"
          class="w-full duration-300 transition-opacity"
          :class="[
            showDocuments ? 'relative z-[71]' : '',
            focusMode ? 'opacity-0 pointer-events-none' : '',
          ]"
        >
          <div class="w-full @container pt-8">
            <div class="flex p-1">
              <button
                :disabled="isEditing"
                class="disabled:bg-secondary text-xs disabled:pointer-events-none disabled:text-secondary-foreground/20 h-8 px-1 bg-primary text-primary-foreground w-full"
                @click="resetStore()"
              >
                {{
                  isEditing
                    ? t("sidebar.creatingNewDocument")
                    : t("sidebar.newDocument")
                }}
              </button>
            </div>
            <div
              class="flex flex-col @xs:flex-row gap-2 mb-1 p-1 justify-between items-center"
            >
              <h1 class="text-xs text-primary">
                Documents
              </h1>
              <div class="flex items-center gap-1">
                <NumberFlow class="text-xs mr-2" :value="documents.length" />
                <Filters />
              </div>
            </div>
            <div
              class="max-h-[calc(100vh-3.75rem)] border-t border-secondary overflow-x-hidden overflow-y-auto"
            >
              <DocumentItem
                v-for="item in documents"
                :key="item.id"
                :data="item"
                @edit="editDocument"
                @toggle="toggleCompleted"
              />
            </div>
          </div>
        </div>
      </SplitterPanel>
      <SplitterResizeHandle
        id="splitter-group-1-resize-handle-1"
        class="w-0.5 bg-secondary data-[state=hover]:bg-primary"
      />
      <SplitterPanel
        id="splitter-group-1-panel-2"
        :min-size="40"
        :class="editable ? 'bg-secondary/20' : ''"
      >
        <div class="new-todo relative px-2 flex flex-col gap-2 h-screen">
          <input
            v-if="editable"
            v-model="newDocumentTitle"
            type="text"
            class="border border-primary px-2 py-2 w-full"
            @keyup.enter="createDocument"
          >
          <h1 v-else class="text-3xl mt-3 font-serif font-semibold px-5">
            {{ newDocumentTitle }}
          </h1>
          <Editor
            :key="newDocumentTitle"
            v-model="newDocumentContent"
            :editor="editor_content"
          />
          <button
            v-show="isEditing"
            class="bg-primary h-12 text-primary-foreground py-2"
            @click="createDocument"
          >
            {{ t("editor.save") }}
          </button>
        </div>
      </SplitterPanel>
      <SplitterResizeHandle
        id="splitter-group-1-resize-handle-2"
        class="w-1 bg-secondary data-[state=hover]:bg-primary"
      />
      <SplitterPanel
        id="splitter-group-1-panel-3"
        class="min-w-10 @container"
        :min-size="15"
        collapsible
        :max-size="40"
        :collapsed-size="0"
      >
        <div class="fixed top-0 right-0 size-8">
          <Tooltip
            name="Toggle Focus"
            side="bottom"
            shortcut="ctrl + shift + alt + F"
            :align="'center'"
          >
            <button
              v-if="focusMode"
              class="size-8 flex justify-center items-center"
              @click="disabledFocusMode()"
            >
              <X class="size-4 pointer-events-none" />
            </button>
          </Tooltip>
        </div>
        <div
          v-show="layout[2] !== 0"
          class="w-full max-h-screen px-1 font-mono min-h-screen duration-300 transition-opacity bg-background text-foreground overflow-x-hidden overflow-y-auto"
          :class="focusMode ? 'opacity-0 pointer-events-none' : ''"
        >
          <div
            class="p-1 flex-wrap flex justify-between items-center text-sm gap-1"
          >
            <strong class="font-bold">ID:</strong>
            <span class=""> {{ `${editable_id.substring(0, 10)}` }}</span>
          </div>
          <div
            class="flex bg-primary/5 text-xs justify-start items-start p-1 gap-2 flex-col"
          >
            <div class="flex gap-2 items-center justify-between w-full">
              <span>{{ t("settings.theme") }}</span>
              <ToggleTheme />
            </div>
            <div class="flex gap-2 items-center justify-between w-full">
              <span>{{ t("commandBar.focusSidebar") }}</span>
              <button
                class="px-2 py-1 border bg-background"
                :class="
                  showDocuments
                    ? 'bg-primary text-primary-foreground border-primary'
                    : ''
                "
                @click="showDocuments = !showDocuments"
              >
                {{ showDocuments }}
              </button>
            </div>
            <div class="flex gap-2 items-center justify-between w-full">
              <span>{{ t("verb.edit") }}</span>
              <button
                class="px-2 py-1 border bg-background"
                :class="
                  editable
                    ? 'bg-primary text-primary-foreground border-primary'
                    : ''
                "
                @click="toggle_editable"
              >
                {{ editable }}
              </button>
            </div>
            <div class="flex gap-2 items-center justify-between w-full">
              <span>{{ t("settings.perspective") }}</span>
              <button
                class="px-2 py-1 border bg-background"
                :class="
                  focusMode
                    ? 'bg-primary text-primary-foreground border-primary'
                    : ''
                "
                @click="focusMode = !focusMode"
              >
                focus
              </button>
            </div>

            <div class="flex gap-2 items-center justify-between w-full">
              <span>{{ t("settings.language") }}</span>
              <DropdownLanguage />
            </div>
          </div>
          <ContentAnalysis />
        </div>
      </SplitterPanel>
    </SplitterGroup>
  </div>
</template>
