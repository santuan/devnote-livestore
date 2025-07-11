<script setup lang="ts">
import type { Ref } from 'vue'
import { queryDb } from '@livestore/livestore'
import { useMagicKeys, whenever } from '@vueuse/core'
import { Circle, CircleOff, Search, X } from 'lucide-vue-next'
import {
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxRoot,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  VisuallyHidden,
} from 'reka-ui'
import { inject, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useClientDocument, useQuery } from 'vue-livestore'
import Tooltip from '@/components/Tooltip.vue'
import { tables } from '@/livestore/schema'

const { newTodoText, newTodoContent } = useClientDocument(tables.uiState)

const visibleTodos$ = queryDb(tables.todos.where({
  deletedAt: null,
}), { label: 'visibleTodos' })

const { t } = useI18n()
const show_commandbar = ref(false)

function close() {
  show_commandbar.value = false
}

const editable_id = inject('editable_id') as Ref<string | null>
const todos = useQuery(visibleTodos$)

function select_document(id: any) {
  const foundTodo = todos.value.find(todo => todo.id === id)
  if (foundTodo) {
    newTodoText.value = foundTodo.text
    newTodoContent.value = foundTodo.content
    editable_id.value = id
    show_commandbar.value = false
  }
}

const keys = useMagicKeys()
const magic_command_menu = keys['ctrl+alt+o']

whenever(magic_command_menu, (n) => {
  if (n)
    show_commandbar.value = true
})
</script>

<template>
  <DialogRoot v-model:open="show_commandbar">
    <Tooltip :name="t('commandBar.title')" side="bottom" shortcut="ctrl + alt + o">
      <DialogTrigger
        class="flex items-center justify-center border interactive border-secondary hover:bg-secondary/80 bg-background size-8"
      >
        <Search class="size-4" />
        <span class="sr-only">{{ t("commandBar.title") }}</span>
      </DialogTrigger>
    </Tooltip>
    <DialogPortal>
      <DialogOverlay class="bg-background/80 fixed inset-0 z-[700]" />
      <DialogContent
        class="fixed top-4 md:top-[15%] left-[50%] w-[90vw] max-w-2xl translate-x-[-50%] text-sm overflow-hidden border bg-background border-muted-foreground/30 focus:outline-hidden z-[701]"
      >
        <VisuallyHidden>
          <DialogTitle>{{ t("commandBar.title") }} </DialogTitle>
          <DialogDescription>{{ t("commandBar.description") }}</DialogDescription>
        </VisuallyHidden>

        <ComboboxRoot :open="true">
          <ComboboxInput
            :placeholder="`${t('verb.search')}&hellip;`" auto-focus
            class="sticky top-0 right-0 font-mono bg-background border-b border-secondary w-full px-4 py-3 text-foreground outline-hidden placeholder-muted-foreground select-all!"
            @keydown.enter.prevent
          />
          <ComboboxContent
            class="border-t border-muted-foreground/30 p-2 overflow-y-auto h-64 sm:h-96"
            @escape-key-down="show_commandbar = false"
          >
            <ComboboxEmpty class="text-center text-muted-foreground p-4">
              {{ t("sidebar.noResults") }}
            </ComboboxEmpty>
            <ComboboxGroup v-if="todos?.length !== 0">
              <ComboboxLabel class="px-4 text-muted-foreground font-semibold mt-3 mb-3 font-mono">
                {{ t("commandBar.documents") }}
              </ComboboxLabel>
              <ComboboxItem
                v-for="item in todos" :key="item.id" :value="item.text || item.id || ''"
                class="cursor-default font-mono text-xs px-4 py-2 rounded-md text-foreground data-highlighted:bg-muted inline-flex justify-between w-full items-center gap-4"
                :class="item.id === editable_id ? 'text-primary underline underline-offset-2 font-extrabold' : ''"
                @select="select_document(item.id)"
              >
                <span>{{ item.text || item.id }}</span>
                <Circle v-if="!item.completed" class="size-4 stroke-current  text-primary" />
                <CircleOff v-else class="size-4 stroke-current  text-primary" />
              </ComboboxItem>
            </ComboboxGroup>
          </ComboboxContent>
        </ComboboxRoot>
        <button
          class="absolute top-0 size-6 flex justify-center items-center m-3 right-0 z-999 text-foreground"
          @click="close"
        >
          <X class="size-4" />
        </button>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
