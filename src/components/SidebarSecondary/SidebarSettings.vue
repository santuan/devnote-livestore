<script setup lang="ts">
import { ChevronsUpDown } from 'lucide-vue-next'
import { shallowRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useClientDocument } from 'vue-livestore'
import { tables } from '@/livestore/schema'
import DropdownLanguage from './DropdownLanguage.vue'
import ToggleTheme from './ToggleTheme.vue'

const props = defineProps<{
  focusMode: boolean
}>()

const emit = defineEmits<{
  (e: 'collapseSecondarySidebar'): void
  (e: 'toggleEditable'): void
  (e: 'focusModeOn'): void
}>()

const { showDocuments, editable } = useClientDocument(tables.uiState)

const { t } = useI18n()

const showSettings = shallowRef(true)
</script>

<template>
  <div class="text-sm">
    <button
      class="flex pl-1 pr-2 w-full h-10 bg-secondary/20 text-left items-center justify-between gap-2"
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
    class=" bg-background text-xs py-1 gap-1 grid @xs:grid-cols-2"
  >
    <div class="flex gap-2 items-center bg-secondary/20 p-1 justify-between w-full">
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
    <div class="flex gap-2 items-center bg-secondary/20 p-1 justify-between w-full">
      <span>{{ t("verb.edit") }}</span>
      <button
        class="px-2 py-1 border bg-background"
        :class="
          editable
            ? 'bg-primary text-primary-foreground border-primary'
            : ''
        "
        @click="emit('toggleEditable')"
      >
        {{ editable }}
      </button>
    </div>
    <div class="flex gap-2 items-center bg-secondary/20 p-1 justify-between w-full">
      <span>{{ t("settings.perspective") }}</span>
      <button
        class="px-2 py-1 border bg-background"
        :class="
          props.focusMode
            ? 'bg-primary text-primary-foreground border-primary'
            : ''
        "
        @click="emit('focusModeOn')"
      >
        focus
      </button>
    </div>
    <div class="flex gap-2 items-center bg-secondary/20 p-1 justify-between w-full">
      <span>{{ t("settings.language") }}</span>
      <DropdownLanguage />
    </div>
    <div class="flex gap-2 items-center bg-secondary/20 p-1 justify-between w-full">
      <span>{{ t("settings.theme") }}</span>
      <ToggleTheme />
    </div>
  </div>
</template>
