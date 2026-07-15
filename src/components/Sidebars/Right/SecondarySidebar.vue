<script setup lang="ts">
import { PanelRightOpen, Pencil, Settings, X } from 'lucide-vue-next'
import {
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from 'reka-ui'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDocumentLifecycle } from '@/composables/useDocumentLifecycle'
import { useSideTabs } from '@/composables/useSideTabs'
import MainToolbar from '../../Tiptap/Toolbar/MainToolbar.vue'
import ContentAnalysis from './ContentAnalysis.vue'
import SidebarSettings from './SidebarSettings.vue'
import TableOfContents from './TableOfContents.vue'

const props = defineProps<{
  focusMode: boolean
  layout: number[]
  editable: boolean
}>()

const emit = defineEmits<{
  (e: 'collapseSecondarySidebar'): void
  (e: 'toggleEditable'): void
  (e: 'focusModeOn'): void
  (e: 'focusModeOff'): void
  (e: 'expandSecondarySidebar'): void
  (e: 'openKeybindings'): void
}>()

const { t } = useI18n()

const { sideTab } = useSideTabs()
const { editable_id } = useDocumentLifecycle()

const tab1Content = ref<HTMLElement | null>(null)
const tab2Content = ref<HTMLElement | null>(null)
const tab3Content = ref<HTMLElement | null>(null)

function focusRef(el: HTMLElement | null) {
  if (el)
    el.focus()
}

watch([sideTab, tab1Content], ([tab, el]) => {
  if (tab === 'tab1')
    focusRef(el)
}, { flush: 'post' })

watch([sideTab, tab2Content], ([tab, el]) => {
  if (tab === 'tab2')
    focusRef(el)
}, { flush: 'post' })

watch([sideTab, tab3Content], ([tab, el]) => {
  if (tab === 'tab3')
    focusRef(el)
}, { flush: 'post' })
</script>

<template>
  <div class="relative w-full h-full">
    <!-- Floating overlay buttons -->
    <button
      v-if="props.focusMode"
      class="size-8 fixed top-0 right-0 z-10 flex justify-center items-center"
      @click="emit('focusModeOff')"
    >
      <X class="size-4 pointer-events-none" />
    </button>
    <button
      v-if="!props.focusMode"
      v-show="props.layout[2] === 0"
      class="size-8 fixed right-0 top-0 flex justify-center items-center"
      @click="emit('expandSecondarySidebar')"
    >
      <PanelRightOpen class="size-5 pointer-events-none" />
    </button>
    <button
      v-if="!props.focusMode"
      class="fixed size-8 flex justify-center items-center z-50"
      :class="[
        !props.editable
          ? 'bg-background'
          : 'bg-primary ring text-primary-foreground ring-secondary',
        props.layout[2] === 0 ? 'right-0 top-9' : 'right-1 top-10',
      ]"
      @click="emit('toggleEditable')"
    >
      <Pencil class="size-3.5" />
      <span class="sr-only"> editable </span>
    </button>
    <button
      class="fixed size-8 flex justify-center items-center z-50 right-0 bottom-0"
      @click="emit('openKeybindings')"
    >
      <Settings class="size-4 pointer-events-none" />
    </button>

    <!-- Main sidebar content -->
    <div
      v-if="props.layout[2] !== 0"
      class="w-full text-xs font-mono z-10 border-l border-secondary duration-300 transition-opacity bg-background text-foreground"
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
        class="p-px max-h-[calc(100vh-2.5rem)]  bg-background  min-h-[calc(100vh-2.5rem)] "
      >
        <TabsRoot v-model="sideTab" class="flex h-[calc(100vh-2.5rem)] flex-col w-full" default-value="tab1">
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
            <!-- <TabsTrigger
              class="bg-secondary px-3 h-8 items-center justify-center text-xs leading-none text-primary select-none opacity-50 data-[state=active]:opacity-100 hover:text-primary data-[state=active]:font-bold data-[state=active]:text-primary outline-none cursor-default focus-visible:relative focus-visible:shadow focus-visible:shadow-primary"
              value="tab3"
            >
              UI
            </TabsTrigger> -->
          </TabsList>
          <TabsContent
            class="grow overflow-x-hidden overflow-y-auto scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thumb-primary scrollbar-track-transparent outline-none pt-0.5 focus:shadow-focus:shadow-primary"
            value="tab1"
          >
            <div ref="tab1Content" tabindex="-1" class="outline-none">
              <SidebarSettings
                @collapse-secondary-sidebar="emit('collapseSecondarySidebar')"
                @focus-mode-on="emit('focusModeOn')"
                @toggle-editable="emit('toggleEditable')"
              />
              <MainToolbar />
            </div>
          </TabsContent>
          <TabsContent
            class="grow overflow-x-hidden overflow-y-auto scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thumb-primary scrollbar-track-transparent outline-none pt-0.5 focus:shadow-focus:shadow-primary"
            value="tab2"
          >
            <div ref="tab2Content" tabindex="-1" class="outline-none">
              <ContentAnalysis />
              <TableOfContents />
            </div>
          </TabsContent>
          <!-- <TabsContent
            class="grow overflow-x-hidden overflow-y-auto scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thumb-primary scrollbar-track-transparent outline-none pt-0.5 focus:shadow-focus:shadow-primary"
            value="tab3"
          >
            <div ref="tab3Content" tabindex="-1" class="outline-none">
              <SidebarSettings
                @collapse-secondary-sidebar="emit('collapseSecondarySidebar')"
                @focus-mode-on="emit('focusModeOn')"
                @toggle-editable="emit('toggleEditable')"
              />
            </div>
          </TabsContent> -->
        </TabsRoot>
      </div>
    </div>
  </div>
</template>

<style>
.indicator {
  width: var(--reka-tabs-indicator-size);
  left: var(--reka-tabs-indicator-position);
}
</style>
