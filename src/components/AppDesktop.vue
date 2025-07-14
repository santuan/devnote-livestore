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
import { ChevronsUpDown, Eye, PanelRightOpen, Plus, X } from 'lucide-vue-next'
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
const input_title = shallowRef<HTMLElement | null>(null)
const focus_logo = shallowRef<HTMLElement | null>(null)
const focusMode = shallowRef(false)
const showSettings = shallowRef(true)
const editor_content = shallowRef()
const editor_toc = shallowRef([])
const sidebar_documents_splitter_ref = shallowRef()
const sidebar_secondary_splitter_ref = shallowRef()
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
      sidebar_documents_splitter_ref.value?.collapse()
    }
    else {
      if (sidebar_documents_splitter_ref.value.isCollapsed) {
        sidebar_documents_splitter_ref.value.resize(resizeTo.value)
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
  focusMode.value = false
  if (sidebar_secondary_splitter_ref.value.isCollapsed) {
    sidebar_secondary_splitter_ref.value.expand()
  }
}

function focusModeOn() {
  focusMode.value = true
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
    focusMode.value = !focusMode.value
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
    if (focus_logo.value instanceof HTMLElement) {
      focus_logo.value.focus()
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
        collapsible
        :collapsed-size="5"
        class="min-w-8 items-start justify-start h-screen"
        :class="[
          showDocuments
            ? 'fixed md:relative min-w-80 md:min-w-auto flex z-[71]'
            : 'hidden lg:flex',
          sidebar_documents_splitter_ref?.isCollapsed ? 'max-w-8!' : '',
          resize === 10 ? ' border-r-2! border-primary!' : '',
        ]"
        @resize="resize = $event"
      >
        <button
          v-show="!focusMode"
          ref="focus_logo"
          class="fixed z-[80] left-0 top-0 flex items-center justify-center gap-2 p-1 w-8 max-h-8 focus-visible:ring-1 focus-within:ring-1 focus-within:ring-primary focus-visible:ring-primary"
          @click="toggle_documents"
        >
          <Logo />
        </button>

        <div
          v-show="!sidebar_documents_splitter_ref?.isCollapsed"
          class="w-full duration-300 transition-opacity"
          :class="[
            showDocuments ? 'relative z-[71]' : '',
            focusMode ? 'opacity-0 pointer-events-none' : '',
          ]"
        >
          <div class="w-full @container ">
            <div
              class="flex mb-3 gap-2 justify-end items-center"
            >
              <div class="flex items-center gap-1">
                <h1 class="text-xs hidden  @xs:flex pl-12 text-primary">
                  documents
                </h1>
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
        <div v-show="!focusMode">
          <DialogCommandMenu />
        </div>
        <div class="fixed bottom-0 right-0">
          <button
            :disabled="isEditing"
            class="disabled:bg-secondary text-xs disabled:pointer-events-none disabled:text-secondary-foreground/20 h-8 w-8 bg-primary text-primary-foreground flex justify-center items-center"
            @click="resetStore()"
          >
            <Plus class="size-4" />
          </button>
        </div>
      </SplitterPanel>
      <SplitterResizeHandle
        id="splitter-group-1-resize-handle-1"
        class="w-0.5 bg-secondary data-[state=hover]:bg-primary"
      />
      <SplitterPanel
        id="splitter-group-1-panel-2"
        class="min-w-1"
        :min-size="20"
        :class="editable ? 'bg-secondary/20' : ''"
      >
        <div class="new-todo  relative px-2 flex flex-col gap-2 h-screen">
          <input
            v-if="editable"
            ref="input_title"
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
        class="w-0.5 bg-secondary data-[state=hover]:bg-primary"
      />
      <SplitterPanel
        id="splitter-group-1-panel-3"
        ref="sidebar_secondary_splitter_ref"
        class="min-w-8 @container"
        :min-size="15"
        collapsible
        :collapsed-size="0"
      >
        <button
          v-if="focusMode"
          class="size-8 fixed top-0 right-0  z-10 flex justify-center items-center"
          @click="focusModeOff()"
        >
          <Eye class="size-4 pointer-events-none" />
        </button>
        <button v-if="!focusMode" v-show="layout[2] === 0" class="size-8 fixed right-0 top-0  flex justify-center items-center" @click="expandSecondarySidebar()">
          <PanelRightOpen class="size-5 pointer-events-none" />
        </button>
        <div
          v-show="layout[2] !== 0"
          class="w-full max-h-screen px-1 font-mono min-h-screen z-10 duration-300 transition-opacity bg-background text-foreground overflow-x-hidden overflow-y-auto"
          :class="focusMode ? 'opacity-0 pointer-events-none' : ''"
        >
          <div
            class="py -1 flex justify-between items-center text-sm gap-1"
          >
            <div class="flex justify-start items-center">
              <strong class="font-bold mr-1">ID:</strong>
              <span class="line-clamp-1 text-muted-foreground"> {{ `${editable_id.substring(0, 30)}` }}</span>
            </div>
            <div>
              <button class="size-8 flex justify-center items-center" @click="collapseSecondarySidebar()">
                <X class="size-4 pointer-events-none" />
              </button>
            </div>
          </div>
          <div class="text-sm">
            <button
              class="flex pl-1 pr-2 w-full h-12 bg-secondary/20 text-left items-center justify-between gap-2"
              @click="showSettings = !showSettings"
            >
              <span class="text-sm font-semibold text-primary">
                {{ t("leva.settings") }}
              </span>
              <span class="flex items-center justify-center size-5">
                <ChevronsUpDown class="text-foreground size-3" />
              </span>
            </button>
          </div>
          <div
            v-show="showSettings"
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
                @click="focusModeOn()"
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
