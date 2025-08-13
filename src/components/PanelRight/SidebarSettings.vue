<script setup lang="ts">
import { useStorage } from '@vueuse/core'
import { ChevronRight } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { useClientDocument } from 'vue-livestore'
import { tables } from '@/livestore/schema'
import DatabaseSettings from './DatabaseSettings.vue'
import DropdownLanguage from './DropdownLanguage.vue'
import ToggleTheme from './ToggleTheme.vue'

const emit = defineEmits<{
  (e: 'collapseSecondarySidebar'): void
  (e: 'toggleEditable'): void
  (e: 'focusModeOn'): void
}>()

const { t } = useI18n()
const { showDocuments, editable } = useClientDocument(tables.uiState)

function toggle_show_documents() {
  showDocuments.value = !showDocuments.value
}

const showSettings = useStorage('show_settings', true)
const showPerspective = useStorage('show_perspective', true)
</script>

<template>
  <div class="bg-background">
    <button
      class="flex pl-1 pr-2 w-full h-8 text-left items-center justify-start gap-2"
      @click="showSettings = !showSettings"
    >
      <ChevronRight
        class="text-foreground size-3 duration-300 transition-transform"
        :class="showSettings ? 'rotate-90' : ''"
      />
      <span class="font-semibold text-primary">
        {{ t("leva.settings") }}
      </span>
    </button>
    <div v-show="showSettings" class="@xs:pl-5">
      <div class="flex gap-2 items-center p-1 justify-between w-full">
        <span>{{ t("settings.language") }}</span>
        <DropdownLanguage />
      </div>
      <div class="flex gap-2 items-center p-1 justify-between w-full">
        <span>{{ t("settings.theme") }}</span>
        <ToggleTheme />
      </div>
    </div>
  </div>
  <DatabaseSettings class="@xs:col-span-3" />
  <div class="bg-background">
    <button
      class="flex pl-1 pr-2 w-full h-8 text-left items-center justify-start gap-2"
      @click="showPerspective = !showPerspective"
    >
      <ChevronRight
        class="text-foreground size-3 duration-300 transition-transform"
        :class="showPerspective ? 'rotate-90' : ''"
      />
      <span class="font-semibold text-primary">
        {{ t("settings.perspective") }}
      </span>
    </button>
    <div
      v-show="showPerspective"
      class="bg-background p-2 @xs:pl-6 gap-3 grid @xs:grid-cols-5"
    >
      <button
        :class="
          showDocuments
            ? 'bg-primary text-primary-foreground border-primary'
            : 'bg-secondary/80'
        "
        class="flex gap-2 items-center p-1 justify-center w-full"
        @click="toggle_show_documents"
      >
        <span>{{ t("commandBar.focusSidebar") }}</span>
      </button>
      <button
        class="flex gap-2 items-center p-1 justify-center w-full"
        :class="
          editable
            ? 'bg-primary text-primary-foreground border-primary'
            : 'bg-secondary/80'
        "
        @click="emit('toggleEditable')"
      >
        <span>{{ t("verb.edit") }}</span>
      </button>
      <button
        class="flex gap-2 items-center p-1 justify-center text-center w-full bg-secondary/80"
        @click="emit('focusModeOn')"
      >
        <span>Focus</span>
      </button>
      <slot />
    </div>
  </div>
</template>
