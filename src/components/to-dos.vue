<script setup lang="ts">
import { queryDb } from '@livestore/livestore'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { Bug, Circle, CircleOff } from 'lucide-vue-next'
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'reka-ui'
import { computed, onMounted, provide, ref, shallowRef, watch, watchEffect } from 'vue'
import { useClientDocument, useQuery, useStore } from 'vue-livestore'
import Editor from '../components/Tiptap/EditorTipTap.vue'
import { events, tables } from '../livestore/schema'
import ButtonDeleteDocument from './ButtonDeleteDocument.vue'
import Toc from './Tiptap/toc/toc.vue'
import ToggleTheme from './ToggleTheme.vue'

const editable_id = ref('')
const editor_content = ref()
const editor_toc = ref([])
const sidebar_splitter_ref = ref()
const right_panel_ref = ref()
const resize = ref(0)
const breakpoints = useBreakpoints(breakpointsTailwind)
const largerThanLg = breakpoints.greater('lg')
const layout = shallowRef<number[]>([0, 0])

const { store } = useStore()
const uiState$ = queryDb(tables.uiState.get(), { label: 'uiState' })
const { newTodoText, newTodoContent, filter, showMenu, editable } = useClientDocument(tables.uiState)

const resizeTo = computed(() => {
  if (largerThanLg.value === true) {
    return 30
  }
  else {
    return 50
  }
})

const rightPanelResizeTo = computed(() => {
  if (largerThanLg.value === true) {
    return 20
  }
  else {
    return 25
  }
})

watch(
  () => showMenu.value,
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
      showMenu.value = true
      return true
    }
    if (resize <= 9) {
      showMenu.value = false
      return true
    }
    return false
  },
  { immediate: true },
)

provide('content', editor_content)
provide('toc', editor_toc)
provide('editable_id', editable_id)

function toggle_editable() {
  editor_content.value?.setEditable(!editable.value)
  editable.value = editor_content.value?.options?.editable
}

function toggleRightPanel() {
  if (!right_panel_ref.value)
    return

  if (right_panel_ref.value.isCollapsed) {
    right_panel_ref.value.resize(rightPanelResizeTo.value)
  }
  else {
    right_panel_ref.value.collapse()
  }
}

const visibleTodos$ = queryDb(
  (get) => {
    const filter = get(uiState$).filter
    return tables.todos.where({
      deletedAt: null,
      completed: filter === 'all' ? undefined : filter === 'completed',
    })
  },
  { label: 'visibleTodos' },
)

const todos = useQuery(visibleTodos$)

function createTodo() {
  const id = crypto.randomUUID()
  store.commit(
    events.todoCreated({
      id,
      text: newTodoText.value,
      content: newTodoContent.value,
    }),
  )
  editable_id.value = id
}

function resetStore() {
  newTodoText.value = ''
  newTodoContent.value = ''
  editable_id.value = ''
}

function newTodo() {
  resetStore()
}

function editTodo(id: string) {
  const foundTodo = todos.value.find(todo => todo.id === id)
  if (foundTodo) {
    newTodoText.value = foundTodo.text
    newTodoContent.value = foundTodo.content
    editable_id.value = id
  }
}

function updateTodo() {
  store.commit(events.todoUpdated({
    id: editable_id.value,
    text: newTodoText.value,
    content: newTodoContent.value,
  }))
}

function toggleCompleted(id: string) {
  if (todos.value.find(todo => todo.id === id)?.completed) {
    store.commit(events.todoUncompleted({ id }))
  }
  else {
    store.commit(events.todoCompleted({ id }))
  }
}

function auto_save() {
  if (!editable_id.value)
    return
  if (newTodoContent.value === '')
    return
  updateTodo()
}

watchEffect(() => {
  if (newTodoContent.value)
    auto_save()
})

const isEditing = computed(() => editable_id.value.length === 0)

onMounted(() => {
  resetStore()
})
</script>

<template>
  <div class="text-foreground">
    <SplitterGroup id="splitter-group-1" direction="horizontal" auto-save-id="app-desktop" @layout="layout = $event">
      <SplitterPanel
        id="splitter-group-1-panel-1" ref="sidebar_splitter_ref" :min-size="10" :max-size="50" collapsible
        :collapsed-size="5"
        class="min-w-10 items-start justify-start h-screen"
        :class="[
          showMenu
            ? 'fixed md:relative min-w-80 md:min-w-auto flex z-[71]'
            : 'hidden lg:flex',
          sidebar_splitter_ref?.isCollapsed ? 'max-w-10!' : '',
          resize === 10 ? ' border-r-2! border-primary!' : '',
        ]"
        @resize="resize = $event"
      >
        <button class="fixed z-[80] left-0 top-0 flex items-center justify-center gap-2 p-1 w-8 max-h-8 focus-visible:ring-1 focus-within:ring-1 focus-within:ring-primary focus-visible:ring-primary" @click="showMenu = !showMenu">
          <svg id="a" xmlns="http://www.w3.org/2000/svg" class="outline-hidden w-6 size-7" viewBox="0 0 384 311.02">
            <path
              d="M.52 127.66V0h37.95c8.63 0 16.12 1.66 22.47 4.98 6.35 3.32 11.28 7.96 14.78 13.9s5.25 12.94 5.25 20.98V87.6c0 8.04-1.75 15.07-5.25 21.07-3.5 6.01-8.42 10.67-14.78 13.99-6.36 3.32-13.85 4.98-22.47 4.98H.52Zm21.86-19.59h16.09c6.3 0 11.31-1.83 15.04-5.51 3.73-3.67 5.6-8.66 5.6-14.95V39.87c0-6.18-1.87-11.1-5.6-14.78-3.73-3.67-8.74-5.51-15.04-5.51H22.38v88.49ZM99.41 127.66v-19.24h158.22V71h-152.1V52.46h152.1V19.24H99.41V0h179.73v127.66H99.41ZM323.49 127.66 291.32 0h22.56l19.41 83.24c1.05 4.08 2.01 8.48 2.89 13.2.87 4.72 1.54 8.48 2.01 11.28.46-2.8 1.14-6.56 2.01-11.28.87-4.72 1.84-9.18 2.89-13.38L361.79 0H384l-32.18 127.66h-28.33ZM0 309.27V181.61h26.76l35.5 103.18c-.35-3.73-.7-8.13-1.05-13.2-.35-5.07-.67-10.23-.96-15.48-.29-5.24-.44-9.91-.44-13.99v-60.51h19.94v127.66H52.99L17.84 206.09c.23 3.38.52 7.46.87 12.24s.64 9.68.87 14.69c.23 5.02.35 9.62.35 13.82v62.43H0ZM137.8 311.02c-12.24 0-21.95-3.5-29.12-10.49-7.17-6.99-10.76-16.67-10.76-29.03v-52.11c0-12.36 3.59-22.03 10.76-29.03 7.17-6.99 16.88-10.49 29.12-10.49s21.95 3.5 29.12 10.49c7.17 7 10.76 16.61 10.76 28.86v52.29c0 12.36-3.59 22.04-10.76 29.03-7.17 6.99-16.88 10.49-29.12 10.49Zm0-19.24c5.95 0 10.43-1.6 13.47-4.81 3.03-3.21 4.55-7.78 4.55-13.73v-55.61c0-5.94-1.52-10.52-4.55-13.73-3.03-3.2-7.52-4.81-13.47-4.81s-10.44 1.61-13.47 4.81c-3.03 3.21-4.55 7.78-4.55 13.73v55.61c0 5.94 1.51 10.52 4.55 13.73 3.03 3.21 7.52 4.81 13.47 4.81ZM223.39 309.27v-107.9h-33.4v-19.76h88.84v19.76h-33.4v107.9H223.4ZM295.27 309.27V181.61h76.59v19.24h-55.08v33.23h48.97v18.54h-48.97v37.42h55.08v19.24h-76.59Z"
              class="fill-primary"
            />
          </svg>
        </button>
        <div
          v-show="!sidebar_splitter_ref?.isCollapsed"
          class="w-full"
          :class="[showMenu ? 'relative z-[71]' : '']"
        >
          <div class="w-full @container pt-8">
            <div class="flex p-1">
              <button
                :disabled="isEditing" class="disabled:bg-secondary disabled:pointer-events-none disabled:text-secondary-foreground/20 h-10 px-1 bg-primary text-primary-foreground w-full"
                @click="newTodo"
              >
                {{ isEditing ? 'Creating doc' : 'New doc' }}
              </button>
            </div>
            <div class="flex flex-col @sm:flex-row gap-2 mb-1 p-1 justify-between items-center">
              <h1>
                Documents {{ filter }}
              </h1>
              <div class="flex gap-1">
                <button
                  class="px-1 border border-primary"
                  :class="filter === 'all' ? 'bg-primary text-primary-foreground' : ''" @click="filter = 'all'"
                >
                  All
                </button>
                <button
                  class="px-1 border border-primary"
                  :class="filter === 'active' ? 'bg-primary text-primary-foreground' : ''" @click="filter = 'active'"
                >
                  <Circle class="size-4" />
                </button>
                <button
                  class="px-1 border border-primary"
                  :class="filter === 'completed' ? 'bg-primary text-primary-foreground' : ''"
                  @click="filter = 'completed'"
                >
                  <CircleOff class="size-4" />
                </button>
              </div>
            </div>
            <div class="max-h-[calc(100vh-3.75rem)] overflow-x-hidden overflow-y-auto @container">
              <div v-for="todo in todos" :key="todo.id" class="border-b border-gray-800 p-3 w-full flex justify-between">
                <div class="view-mode w-full flex gap-1 flex-col sm:flex-row">
                  <button
                    class="line-clamp-1 w-full text-left" :class="todo.id === editable_id ? 'text-primary font-bold' : ''"
                    @click="editTodo(todo.id)"
                  >
                    {{ todo.text.length === 0 ? '---' : todo.text }}
                  </button>
                  <div class="flex gap-1 items-center justify-end">
                    <button class="px-3 border border-secondary h-8" @click="toggleCompleted(todo.id)">
                      <Circle v-if="!todo.completed" class="size-4" />
                      <CircleOff v-else class="size-4" />
                    </button>
                    <ButtonDeleteDocument :id="todo.id" :title="todo.text" class="px-3  border border-secondary py-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <transition>
            <div
              v-show="resize < 10"
              v-if="!sidebar_splitter_ref?.isCollapsed"
              class="absolute top-0 right-0 z-[200] transition-opacity h-screen w-5 duration-1000 bg-gradient-to-r from-transparent bottom-0 to-background"
              :class="resize === 10 ? 'to-primary opacity-20' : 'opacity-100'"
            />
          </transition>
        </div>
      </SplitterPanel>
      <SplitterResizeHandle
        id="splitter-group-1-resize-handle-1"
        class="w-1 bg-secondary  data-[state=hover]:bg-primary"
      />
      <SplitterPanel id="splitter-group-1-panel-2" :min-size="20">
        <div class="new-todo relative px-2 flex flex-col gap-2 h-screen">
          <input
            v-model="newTodoText" type="text" class="border border-primary px-2 py-2 w-full"
            @keyup.enter="createTodo"
          >
          <Editor :key="newTodoText" v-model="newTodoContent" :editor="editor_content" />
          <button v-show="isEditing" class="bg-primary font-mono h-12 text-primary-foreground py-2" @click="createTodo">
            Add Todo
          </button>
        </div>
      </SplitterPanel>
      <SplitterResizeHandle
        id="splitter-group-1-resize-handle-2"
        class="w-1 bg-secondary  data-[state=hover]:bg-primary"
      />
      <SplitterPanel id="splitter-group-1-panel-3" ref="right_panel_ref" class="min-w-10" :min-size="9" collapsible :max-size="25" :collapsed-size="0">
        <button class="fixed z-[80] right-0 bottom-0 flex items-center justify-center gap-2 p-1 size-10 ring-1 ring-primary" @click="toggleRightPanel">
          <Bug class="size-4" />
        </button>
        <div
          v-show="layout[2] !== 0"
          class="w-full max-h-screen  font-mono min-h-screen bg-background text-foreground overflow-x-hidden overflow-y-auto"
        >
          <div
            class="p-1 sticky flex-wrap top-0 bg-secondary flex justify-between items-center text-sm gap-1  "
          >
            <strong class="font-black">id:</strong>
            <span> {{ `${editable_id.substring(0, 30)}…` }}</span>
          </div>
          <div class="flex bg-secondary justify-start text-sm items-start p-1 gap-2 flex-col ">
            <div class="flex gap-2 items-center justify-between w-full">
              <span>Theme:</span>
              <ToggleTheme />
            </div>
            <div class="flex gap-2 items-center justify-between w-full">
              <span>
                Show documents
              </span>
              <button class="px-2 py-1 border bg-background" @click="showMenu = !showMenu">
                {{ showMenu }}
              </button>
            </div>
            <div class="flex gap-2 items-center justify-between w-full">
              <span>
                Editable
              </span>
              <button class="px-2 py-1 border bg-background" @click="toggle_editable">
                {{ editable }}
              </button>
            </div>
            <div class="flex gap-2 items-center justify-between w-full">
              <span>
                Secondary sidebar
              </span>
              <button class="px-2 py-1 border bg-background" @click="toggleRightPanel">
                {{ editable }}
              </button>
            </div>
          </div>
          <div class="w-full p-1">
            <Toc :editor="editor_content" :items="editor_toc" />
          </div>
          <!-- <article class="prose prose-invert  px-6 max-w-3xl mx-auto" v-html="newTodoContent" /> -->
        </div>
      </SplitterPanel>
    </SplitterGroup>
  </div>
</template>
