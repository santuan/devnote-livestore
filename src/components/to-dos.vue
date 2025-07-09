<script setup lang="ts">
import { queryDb } from '@livestore/livestore'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { Circle, CircleOff } from 'lucide-vue-next'
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'reka-ui'
import { computed, onMounted, provide, ref, shallowRef, watch, watchEffect } from 'vue'
import { useClientDocument, useQuery, useStore } from 'vue-livestore'
import Editor from '../components/Tiptap/EditorTipTap.vue'
import { events, tables } from '../livestore/schema'
import ButtonDeleteDocument from './ButtonDeleteDocument.vue'
import Toc from './Tiptap/toc/toc.vue'
import ToggleTheme from './ToggleTheme.vue'

const { store } = useStore()

const uiState$ = queryDb(tables.uiState.get(), { label: 'uiState' })
const { newTodoText, newTodoContent, filter, showMenu, editable } = useClientDocument(tables.uiState)
const editable_id = ref('')
const editor_content = ref()
const editor_toc = ref([])

const sidebar_splitter_ref = ref()
const resize = ref(0)

const breakpoints = useBreakpoints(breakpointsTailwind)
const largerThanLg = breakpoints.greater('lg')
const layout = shallowRef<number[]>([0, 0])

const resizeTo = computed(() => {
  if (largerThanLg.value === true) {
    return 30
  }
  else {
    return 50
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

provide(/* key */ 'content', /* value */ editor_content)
provide(/* key */ 'toc', /* value */ editor_toc)
provide(/* key */ 'editable_id', /* value */ editable_id)

function toggle_editable() {
  editor_content.value?.setEditable(!editable.value)
  editable.value = editor_content.value?.options?.editable
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
        <div
          v-show="!sidebar_splitter_ref?.isCollapsed"
          class="w-full"
          :class="[showMenu ? 'relative z-[71]' : '']"
        >
          <div class="w-full @container">
            <div class="flex p-1">
              <button
                :disabled="isEditing" class="disabled:bg-primary/50 px-1 bg-primary text-primary-foreground w-full"
                @click="newTodo"
              >
                {{ isEditing ? 'Creando doc' : 'Nuevo doc' }}
              </button>
            </div>
            <div class="flex gap-2 mb-1 p-1 justify-between items-center">
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
                    <!-- <button class="px-3 border border-secondary py-1" @click="deleteTodo(todo.id)">
                    Delete
                  </button> -->
                    <ButtonDeleteDocument :id="todo.id" :title="todo.text" class="px-3  border border-secondary py-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <transition>
            <div
              v-show="resize < 25"
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
          <button v-show="isEditing" class="bg-primary h-12 text-primary-foreground py-2" @click="createTodo">
            Add Todo
          </button>
        </div>
      </SplitterPanel>
      <SplitterResizeHandle
        id="splitter-group-1-resize-handle-2"
        class="w-1 bg-secondary  data-[state=hover]:bg-primary"
      />
      <SplitterPanel id="splitter-group-1-panel-3" :min-size="15" collapsible :max-size="25" :collapsed-size="0">
        <div class="w-full max-h-screen font-mono min-h-screen bg-background text-foreground overflow-x-hidden overflow-y-auto">
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
