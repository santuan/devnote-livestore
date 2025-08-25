<script setup lang="ts">
import type { Ref } from 'vue'
import { useStorage } from '@vueuse/core'
import { X } from 'lucide-vue-next'
import {
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from 'reka-ui'
import { inject } from 'vue'
import { useI18n } from 'vue-i18n'
import EditorToolbar from '../Tiptap/Toolbar/EditorToolbar.vue'
import ContentAnalysis from './ContentAnalysis.vue'
import DatabaseSettings from './DatabaseSettings.vue'
import SidebarSettings from './SidebarSettings.vue'
import TableOfContent from './TableOfContent.vue'

const props = defineProps<{
  focusMode: boolean
}>()

const emit = defineEmits<{
  (e: 'collapseSecondarySidebar'): void
  (e: 'toggleEditable'): void
  (e: 'focusModeOn'): void
}>()
const { t } = useI18n()

const sidetabTab = useStorage('values', 'tab1')

const editable_id = inject('editable_id') as Ref<string | null>
</script>

<template>
  <div
    class="w-full text-xs font-mono z-10 duration-300 transition-opacity bg-background text-foreground"
    :class="props.focusMode ? 'opacity-0 pointer-events-none' : ''"
  >
    <div
      class="p-1 pr-1 flex sticky top-0 right-0 z-10 bg-background justify-between items-center text-xs gap-1"
    >
      <div class="flex justify-start items-center">
        <strong class="font-bold mr-1">ID:</strong>
        <span class="line-clamp-1 text-muted-foreground">
          {{ `${editable_id?.substring(0, 30)}` }}</span>
      </div>
      <div>
        <button
          class="size-8 flex justify-center items-center"
          @click="emit('collapseSecondarySidebar')"
        >
          <X class="size-4 pointer-events-none" />
        </button>
      </div>
    </div>
    <div
      class="p-px max-h-[calc(100vh-2.5rem)] bg-background  min-h-[calc(100vh-2.5rem)] "
    >
      <TabsRoot v-model="sidetabTab" class="flex h-[calc(100vh-2.5rem)] flex-col w-full" default-value="tab1">
        <TabsList
          class="relative shrink-0 flex justify-start border-b border-secondary overflow-x-hidden overflow-y-hidden max-w-[98%]"
          aria-label="Secondary sidebar"
        >
          <TabsIndicator
            class="indicator absolute px-0 left-0 h-1 bottom-0 translate-y-px"
          >
            <div class="bg-primary w-full h-full" />
          </TabsIndicator>
          <TabsTrigger
            class="bg-secondary px-3 h-8 items-center justify-center text-xs leading-none text-primary select-none opacity-50 data-[state=active]:opacity-100 hover:text-primary data-[state=active]:font-bold data-[state=active]:text-primary outline-none cursor-default focus-visible:relative focus-visible:shadow focus-visible:shadow-primary"
            value="tab1"
          >
            Format
          </TabsTrigger>
          <TabsTrigger
            class="bg-secondary px-3 h-8 items-center justify-center text-xs leading-none text-primary select-none opacity-50 data-[state=active]:opacity-100 hover:text-primary data-[state=active]:font-bold data-[state=active]:text-primary outline-none cursor-default focus-visible:relative focus-visible:shadow focus-visible:shadow-primary"
            value="tab2"
          >
            {{ t("leva.document") }}
          </TabsTrigger>
          <TabsTrigger
            class="bg-secondary px-3 h-8 items-center justify-center text-xs leading-none text-primary select-none opacity-50 data-[state=active]:opacity-100 hover:text-primary data-[state=active]:font-bold data-[state=active]:text-primary outline-none cursor-default focus-visible:relative focus-visible:shadow focus-visible:shadow-primary"
            value="tab3"
          >
            {{ t("leva.settings") }}
          </TabsTrigger>
        </TabsList>
        <TabsContent
          class="grow overflow-x-hidden overflow-y-auto scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thumb-primary scrollbar-track-transparent outline-none pt-0.5 focus:shadow-focus:shadow-primary"
          value="tab1"
        >
          <EditorToolbar />
        </TabsContent>
        <TabsContent
          class="grow overflow-x-hidden overflow-y-auto scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thumb-primary scrollbar-track-transparent outline-none pt-0.5 focus:shadow-focus:shadow-primary"
          value="tab2"
        >
          <ContentAnalysis />
          <TableOfContent />
        </TabsContent>
        <TabsContent
          class="grow overflow-x-hidden overflow-y-auto scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thumb-primary scrollbar-track-transparent outline-none pt-0.5 focus:shadow-focus:shadow-primary"
          value="tab3"
        >
          <SidebarSettings
            @collapse-secondary-sidebar="emit('collapseSecondarySidebar')"
            @focus-mode-on="emit('focusModeOn')"
            @toggle-editable="emit('toggleEditable')"
          >
            <slot />
          </SidebarSettings>

          <DatabaseSettings />
        </TabsContent>
      </TabsRoot>
    </div>
  </div>
</template>

<style>
.indicator {
  width: var(--reka-tabs-indicator-size);
  left: var(--reka-tabs-indicator-position);
}
</style>
