<script setup lang="ts">
import {
  breakpointsTailwind,
  useBreakpoints,
  useColorMode,
  useStorage,
} from '@vueuse/core'
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'reka-ui'
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  provide,
  shallowRef,
  watch,
} from 'vue'
import EditorPanel from '@/components/EditorPanel.vue'
import DocumentSidebar from '@/components/Sidebars/Left/DocumentSidebar.vue'
import SidebarSecondary from '@/components/Sidebars/Right/SecondarySidebar.vue'
import KeybindingPanel from '@/components/UI/KeybindingPanel.vue'
import { useDocumentLifecycle } from '@/composables/useDocumentLifecycle'
import { useEditor } from '@/composables/useEditor'
import { useFocusMode } from '@/composables/useFocusMode'
import { useLayoutPresets } from '@/composables/useLayoutPresets'
import { usePrefixMode } from '@/composables/usePrefixMode'
import { useSidebarCollapse } from '@/composables/useSidebarCollapse'
import { useSideTabs } from '@/composables/useSideTabs'
import { useSplitterPairing } from '@/composables/useSplitterPairing'
import { useToggleColorTheme } from '@/composables/useToggleColorTheme'

const colorTheme = useStorage('theme', 'theme-foreground')

const focus_logo = shallowRef<HTMLElement | null>(null)
const resize = shallowRef(0)
const keybindingPanelRef = shallowRef()
const commandMenuRef = shallowRef<{ open: () => void } | undefined>()
provide('commandMenuRef', commandMenuRef)
const editorPanelRef = shallowRef<InstanceType<typeof EditorPanel> | null>(null)

const {
  editable_id,
  newDocumentTitle,
  newDocumentContent,
  showDocuments,
  editable,
  documents,
  documents_count,
  createDocument,
  resetStore,
  editDocument,
  toggleCompleted,
} = useDocumentLifecycle()

const {
  editorRef,
  focusEditor,
  focusTitle,
} = useEditor()

const {
  focus_mode,
  focusModeOn,
  focusModeOff,
  toggleFocusMode,
} = useFocusMode()

const {
  sidebar_documents_splitter_ref,
  sidebar_secondary_splitter_ref,
  toggle_documents,
  hide_panel_left,
  collapseSecondarySidebar,
  expandSecondarySidebar,
} = useSidebarCollapse()

const {
  layout,
  applyPreset,
  onLayoutChange,
} = useLayoutPresets()

const { selectTab } = useSideTabs()

const { isActive: prefixActive, onCommand, offCommand } = usePrefixMode()

const {
  pairingActive,
  onContextMenu,
  onDoubleClick,
  onHandlePointerDown,
  onHandleDragging,
  onLayoutChange: onPairingLayoutChange,
} = useSplitterPairing({
  leftSplitter: sidebar_documents_splitter_ref,
  rightSplitter: sidebar_secondary_splitter_ref,
})

const isEditing = computed(() => editable_id.value.length === 0)
const breakpoints = useBreakpoints(breakpointsTailwind)
const largerThanLg = breakpoints.greater('lg')

// --- Document helpers ---
function toggle_editable() {
  editorRef.value?.setEditable(!editable.value)
  editable.value = editorRef.value?.options?.editable
}

function createAndFocus() {
  resetStore()
  nextTick(() => focusEditor())
}

function editDocumentResponsive(id: string) {
  editDocument(id)
  if (!largerThanLg.value) {
    showDocuments.value = false
  }
}

onCommand('toggleSidebar', toggle_documents)
onCommand('toggleEditable', toggle_editable)
onCommand('newDocument', createAndFocus)
onCommand('focusTitle', () => focusTitle(editorPanelRef.value?.inputTitleRef ?? null))
onCommand('focusEditor', focusEditor)
onCommand('focusLogo', () => {
  if (sidebar_documents_splitter_ref.value?.isCollapsed) {
    // sidebar_documents_splitter_ref.value.expand()
    if (focus_logo.value instanceof HTMLElement) {
      focus_logo.value.focus()
    }
  }
  else {
    // sidebar_documents_splitter_ref.value?.collapse()
    if (focus_logo.value instanceof HTMLElement) {
      focus_logo.value.focus()
    }
  }
})
onCommand('toggleSecondarySidebar', () => {
  if (sidebar_secondary_splitter_ref.value?.isCollapsed) {
    expandSecondarySidebar()
  }
  else {
    collapseSecondarySidebar()
  }
})
onCommand('navigateNextDocument', () => {
  if (documents.value.length === 0)
    return
  const currentIndex = documents.value.findIndex(doc => doc.id === editable_id.value)
  const nextIndex = currentIndex !== -1 ? (currentIndex + 1) % documents.value.length : 0
  editDocument(documents.value[nextIndex]?.id)
})
onCommand('navigatePreviousDocument', () => {
  if (documents.value.length === 0)
    return
  const currentIndex = documents.value.findIndex(doc => doc.id === editable_id.value)
  const prevIndex = currentIndex === 0 ? documents.value.length - 1 : (currentIndex !== -1 ? currentIndex - 1 : 0)
  editDocument(documents.value[prevIndex]?.id)
})
onCommand('windowLayout1', () => applyPreset('layout1'))
onCommand('windowLayout2', () => applyPreset('layout2'))
onCommand('windowLayout3', () => applyPreset('layout3'))
onCommand('windowLayout4', () => applyPreset('layout4'))
onCommand('windowLayout5', () => applyPreset('layout5'))
onCommand('focusMode', toggleFocusMode)
onCommand('selectSideTab1', () => {
  selectTab('tab1')
  if (sidebar_secondary_splitter_ref.value?.isCollapsed) {
    expandSecondarySidebar()
  }
})
onCommand('selectSideTab2', () => {
  selectTab('tab2')
  if (sidebar_secondary_splitter_ref.value?.isCollapsed) {
    expandSecondarySidebar()
  }
})
onCommand('selectSideTab3', () => {
  selectTab('tab3')
  if (sidebar_secondary_splitter_ref.value?.isCollapsed) {
    expandSecondarySidebar()
  }
})
onCommand('openKeybindingPanel', () => keybindingPanelRef.value?.open())
onCommand('openCommandMenu', () => commandMenuRef.value?.open())

// --- Unified layout handler: presets + pairing ---
function onSplitterLayoutChange(newLayout: number[]) {
  onLayoutChange(newLayout)
  onPairingLayoutChange(newLayout)
}

// --- Sidebar resize → show/hide documents ---
watch(
  () => resize.value,
  (size) => {
    if (!size)
      return
    const shouldShow = size >= 10
    if (shouldShow !== showDocuments.value) {
      showDocuments.value = shouldShow
    }
  },
  { flush: 'post' },
)

onMounted(() => {
  useColorMode()
  useToggleColorTheme(colorTheme.value)

  onBeforeUnmount(() => {
    offCommand('toggleSidebar')
    offCommand('toggleEditable')
    offCommand('newDocument')
    offCommand('focusTitle')
    offCommand('focusEditor')
    offCommand('focusLogo')
    offCommand('toggleSecondarySidebar')
    offCommand('navigateNextDocument')
    offCommand('navigatePreviousDocument')
    offCommand('windowLayout1')
    offCommand('windowLayout2')
    offCommand('windowLayout3')
    offCommand('windowLayout4')
    offCommand('windowLayout5')
    offCommand('focusMode')
    offCommand('openKeybindingPanel')
    offCommand('openCommandMenu')
  })
})
</script>

<template>
  <div class="font-mono text-foreground">
    <SplitterGroup
      id="splitter-group-1"
      direction="horizontal"
      auto-save-id="app-desktop"
      @layout="onSplitterLayoutChange"
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
            ? 'fixed md:relative min-w-80 md:min-w-auto  flex z-71'
            : 'hidden lg:flex',
          sidebar_documents_splitter_ref?.isCollapsed ? 'max-w-8!' : '',
          resize === 10 ? ' border-r-2! border-primary!' : '',
        ]"
        @dblclick="focusModeOff()"
        @resize="resize = $event"
      >
        <DocumentSidebar
          :is-editing="isEditing"
          :focus-mode="focus_mode"
          :show-documents="showDocuments"
          :documents="documents"
          :documents-count="documents_count"
          :sidebar-documents-splitter-ref="sidebar_documents_splitter_ref"
          :prefix-active="prefixActive"
          @toggle-documents="toggle_documents"
          @hide-panel-left="hide_panel_left"
          @create-and-focus="createAndFocus"
          @edit-document="editDocumentResponsive"
          @toggle-completed="toggleCompleted"
          @focus-mode-off="focusModeOff"
          @focus-logo="focus_logo = $event"
        />
      </SplitterPanel>
      <SplitterResizeHandle
        id="splitter-group-1-resize-handle-1"
        class="resize-handle hidden md:flex justify-center relative items-center min-w-1"
        :class="[pairingActive ? 'bg-primary/30! resize-handle-active' : '']"
        oncontextmenu="return false;"
        @contextmenu.prevent="onContextMenu($event, 'left')"
        @dblclick="onDoubleClick('left')"
        @pointerdown="onHandlePointerDown('left')"
        @dragging="onHandleDragging('left', $event)"
      >
        <p class="message" oncontextmenu="return false;">
          {{ pairingActive ? "Pairing active" : "Right-click to pair" }}
        </p>
      </SplitterResizeHandle>

      <SplitterPanel
        id="splitter-group-1-panel-2"
        class="min-w-1"
        :min-size="20"
        :class="editable ? 'bg-secondary/20' : ''"
      >
        <EditorPanel
          ref="editorPanelRef"
          v-model:content="newDocumentContent"
          v-model:title="newDocumentTitle"
          :editable-id="editable_id"
          :editable="editable"
          :is-editing="isEditing"
          :editor-ref="editorRef"
          @create-document="createDocument"
        />
      </SplitterPanel>
      <SplitterResizeHandle
        id="splitter-group-1-resize-handle-2"
        class="resize-handle hidden md:flex justify-center relative items-center min-w-1"
        :class="[pairingActive ? 'bg-primary/30! resize-handle-active' : '']"
        oncontextmenu="return false;"
        @contextmenu.prevent="onContextMenu($event, 'right')"
        @dblclick="onDoubleClick('right')"
        @pointerdown="onHandlePointerDown('right')"
        @dragging="onHandleDragging('right', $event)"
      >
        <p class="message" oncontextmenu="return false;">
          {{ pairingActive ? "Pairing active" : "Right-click to pair" }}
        </p>
      </SplitterResizeHandle>

      <SplitterPanel
        id="splitter-group-1-panel-3"
        ref="sidebar_secondary_splitter_ref"
        class="min-w-8 @container"
        :min-size="15"
        :max-size="30"
        collapsible
        :collapsed-size="0"
        @dblclick="focusModeOff()"
      >
        <SidebarSecondary
          :focus-mode="focus_mode"
          :layout="layout"
          :editable="editable"
          @collapse-secondary-sidebar="collapseSecondarySidebar"
          @expand-secondary-sidebar="expandSecondarySidebar"
          @focus-mode-on="focusModeOn"
          @focus-mode-off="focusModeOff"
          @toggle-editable="toggle_editable"
          @open-keybindings="keybindingPanelRef?.open()"
        />
      </SplitterPanel>
    </SplitterGroup>
    <KeybindingPanel ref="keybindingPanelRef" />
  </div>
</template>
