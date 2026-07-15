<script lang="ts" setup>
import NumberFlow from '@number-flow/vue'
import { X } from 'lucide-vue-next'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFocusMode } from '@/composables/useFocusMode'
import DialogCommandMenu from '../../UI/DialogCommandMenu.vue'
import DocumentFilters from './DocumentFilters.vue'

const props = defineProps<{
  count: number
}>()

const emit = defineEmits<{
  (e: 'open'): void
}>()

const { focus_mode } = useFocusMode()
const { t } = useI18n()

const documents = computed(() => props.count ?? 0)
</script>

<template>
  <div class="w-full @container">
    <div class="flex mb-px gap-1 justify-end items-center">
      <div v-show="!focus_mode">
        <DialogCommandMenu />
      </div>
      <button
        class="size-8 flex justify-center items-center"
        @click="emit('open')"
      >
        <X class="size-4" />
      </button>
    </div>
    <slot name="top" />
    <div class="flex justify-between mt-px pl-1 mb-2 py-px items-center">
      <DocumentFilters>
        <div class="flex justify-start items-center">
          <h1
            class="text-sm mr-2 capitalize sr-only @min-[300px]:not-sr-only text-foreground"
          >
            {{ t("commandBar.documents") }}
          </h1>
          <NumberFlow class="text-xs bg-primary/20 px-3 mx-1" :value="documents" />
        </div>
      </DocumentFilters>
    </div>
    <div
      class="max-h-[calc(100vh-6.5rem)] scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thumb-primary scrollbar-track-transparent h-screen border-t border-secondary overflow-x-hidden overflow-y-auto"
    >
      <slot name="list" />
    </div>
  </div>
</template>
