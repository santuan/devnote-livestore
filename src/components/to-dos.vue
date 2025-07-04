<script setup lang="ts">
import { queryDb } from '@livestore/livestore'
import { events, tables } from '../livestore/schema'
import { useStore, useQuery, useClientDocument } from 'vue-livestore'
import Editor from '../components/editor-tiptap.vue'


const { store } = useStore()

// Query & subscription
const uiState$ = queryDb(tables.uiState.get(), { label: 'uiState' })

const visibleTodos$ = queryDb(
  (get) => {
    const filter = get(uiState$).filter
    return tables.todos.where({
      deletedAt: null,
      completed: filter === 'all' ? undefined : filter === 'completed'
    })
  },
  { label: 'visibleTodos' },
)

const { newTodoText, newTodoContent, filter } = useClientDocument(tables.uiState)
const todos = useQuery(visibleTodos$)

// Events
const createTodo = () => {
  store.commit(events.todoCreated({ id: crypto.randomUUID(), text: newTodoText.value, content: newTodoContent.value }))
  newTodoText.value = ''
  newTodoContent.value = ''
}

const deleteTodo = (id: string) => {
  store.commit(events.todoDeleted({ id, deletedAt: new Date() }))
}

const toggleCompleted = (id: string) => {
  if (todos.value.find((todo) => todo.id === id)?.completed) {
    store.commit(events.todoUncompleted({ id }))
  } else {
    store.commit(events.todoCompleted({ id }))
  }
}
</script>

<template>
  <div class="desktop">
    <div class="todos">
      Todos
      <div class="filters">
        <button @click="filter = 'all'" :class="{ active: filter === 'all' }">All</button>
        <button @click="filter = 'active'" :class="{ active: filter === 'active' }">Active</button>
        <button @click="filter = 'completed'" :class="{ active: filter === 'completed' }">Completed</button>
      </div>
      <div v-for="todo in todos" :key="todo.id" class="todo">
        <span :class="{ completed: todo.completed }">
          {{ todo.text }} --
          {{ todo.content }}
        </span>
        <button @click="toggleCompleted(todo.id)">Complete</button>
        <button @click="deleteTodo(todo.id)">Delete</button>
      </div>
    </div>
  </div>
  <div class="new-todo">
    <h2>Titulo</h2>
    <input type="text" v-model="newTodoText" @keyup.enter="createTodo" />
    <h2>Contenido</h2>
    <!-- <input type="text" v-model="newTodoContent" @keyup.enter="createTodo" /> -->
    <Editor v-model="newTodoContent" />
    {{ newTodoContent }}
    <button @click="createTodo">Add Todo</button>
  </div>
</template>

<style>
.desktop {
  display: flex;
  width: 100%;
}

.completed {
  text-decoration: line-through;
}

.todos {
  display: flex;
  flex-direction: column;
  width: 100%;

  gap: 10px;
}

.todo,
.new-todo {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  background-color: #333;
  padding: 1rem;
}

.filters {
  display: flex;
  gap: 10px;
}

.filters button.active {
  background-color: #000;
  color: #fff;
}
</style>