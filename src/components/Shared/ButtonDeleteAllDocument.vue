<script setup lang="ts">
import { Trash2, X } from 'lucide-vue-next'
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogRoot,
  AlertDialogTitle,
  AlertDialogTrigger,
} from 'reka-ui'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vue-livestore'
import { events } from '@/livestore/schema'

const { store } = useStore()

const show_delete_document_all_modal = ref(false)

function deleteAllDocuments() {
  store.commit(
    events.documentDeletedAll({
      deletedAt: new Date(),
    }),
  )
}

const { t } = useI18n()
</script>

<template>
  <AlertDialogRoot v-model:open="show_delete_document_all_modal">
    <AlertDialogTrigger class="px-3 bg-destructive h-8">
      <Trash2 class="size-4 pointer-events-none" />
      <span class="select-none! text-destructive-foreground sr-only">{{ t("editor.delete") }}</span>
    </AlertDialogTrigger>
    <AlertDialogPortal>
      <AlertDialogOverlay class="fixed inset-0 z-[904] bg-black/50" />
      <AlertDialogContent
        class="fixed z-[905] w-[95vw] max-w-sm rounded-lg p-4 md:w-full top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] bg-background text-foreground border border-secondary font-mono"
      >
        <AlertDialogTitle class="text-sm font-light pr-12">
          {{ t("editor.deleteAll") }}
        </AlertDialogTitle>
        <AlertDialogDescription class="mt-3 mb-5 text-xs">
          {{ t("editor.deleteConfirm") }}
        </AlertDialogDescription>
        <div class="flex justify-between gap-x-2">
          <AlertDialogCancel as-child>
            <button
              class="bg-secondary ring-1 ring-secondary! text-foreground hover:bg-background hover:ring-2 hover:ring-foreground inline-flex h-[35px] items-center justify-center rounded-[4px] px-3 text-xs font-semibold leading-none focus-visible:ring-2 focus:outline-foreground"
            >
              {{ t("verb.cancel") }}
            </button>
          </AlertDialogCancel>
          <AlertDialogAction as-child>
            <button
              class="bg-red-600 text-white hover:bg-red-600/80 text-xs inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-semibold leading-none hover:outline-hidden focus:outline-2 focus:outline-foreground focus:outline-dashed focus:outline-offset-2"
              @click="deleteAllDocuments()"
            >
              {{ t("verb.delete") }}
            </button>
          </AlertDialogAction>
        </div>
        <AlertDialogCancel
          class="absolute top-0 size-6 flex justify-center items-center m-3 right-0 z-999 text-foreground"
        >
          <X class="size-4" />
        </AlertDialogCancel>
      </AlertDialogContent>
    </AlertDialogPortal>
  </AlertDialogRoot>
</template>
