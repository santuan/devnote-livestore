<script lang="ts">
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import { useElementSize } from '@vueuse/core'
import {
  Clipboard,
  ClipboardCheck,
  Maximize,
  Minimize2,
} from 'lucide-vue-next'
import {
  ScrollAreaRoot,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from 'reka-ui'
import { bundledLanguages } from 'shiki/bundle/full'
import { shallowRef } from 'vue'
import ListboxVirtual from '../Shared/ListboxVirtual.vue'

export default {
  components: {
    NodeViewWrapper,
    NodeViewContent,
    ListboxVirtual,
    Clipboard,
    ClipboardCheck,
    Maximize,
    Minimize2,
    ScrollAreaRoot,
    ScrollAreaScrollbar,
    ScrollAreaThumb,
    ScrollAreaViewport,
  },

  props: nodeViewProps,

  setup() {
    const codeHeight = shallowRef(null)

    const { width, height } = useElementSize(codeHeight)
    return {
      codeHeight,
      width,
      height,
    }
  },

  data() {
    return {
      languages: Object.keys(bundledLanguages),
      copyText: 'Copy',
      copyTextError: false,
      showFullCode: false,
      isEditingTitle: false, // Add this
      titleInput: '', // Add this
    }
  },

  computed: {
    selectedLanguage: {
      get() {
        return this.node.attrs.language
      },
      set(language: any) {
        this.updateAttributes({ language })
      },
    },
    codeTitle: {
      get() {
        return this.node.attrs.title || ''
      },
      set(title: string) {
        this.updateAttributes({ title })
      },
    },
  },
  methods: {
    copyToClipboard(successful = () => null, failure = () => null) {
      if (this.node.content.size === 0) {
        this.copyTextError = true
        setTimeout(() => {
          this.copyTextError = false
        }, 3000)
        return
      }
      const clipboard = navigator.clipboard
      const value = this.node.content.content[0].text || ''
      if (clipboard !== undefined) {
        navigator.clipboard.writeText(value).then(successful, failure)
        this.copyText = 'Copied'
      }
      else {
        if (document.execCommand) {
          const el = document.createElement('textarea')
          el.value = value
          document.body.append(el)
          el.select()
          el.setSelectionRange(0, value.length)
          if (document.execCommand('copy')) {
            this.copyText = 'Copied' // popper?
          }
          el.remove()
        }
        else {
          this.copyText = 'Error!'
        }
      }
      setTimeout(() => {
        this.copyText = 'copy'
      }, 1000)
    },

    startEditingTitle() {
      this.isEditingTitle = true
      this.titleInput = this.codeTitle
      this.$nextTick(() => {
        const titleInput = this.$refs.titleInput as HTMLInputElement | undefined
        titleInput?.focus?.()
      })
    },

    saveTitle() {
      this.codeTitle = this.titleInput.trim()
      this.isEditingTitle = false
    },

    cancelTitleEdit() {
      this.isEditingTitle = false
      this.titleInput = ''
    },

    handleTitleKeydown(event: KeyboardEvent) {
      if (event.key === 'Enter') {
        event.preventDefault()
        this.saveTitle()
      }
      else if (event.key === 'Escape') {
        event.preventDefault()
        this.cancelTitleEdit()
      }
    },
  },
}
</script>

<template>
  <NodeViewWrapper
    class="code-block group ring-1 ring-muted"
    spellcheck="false"
    :class="[
      showFullCode
        ? 'fixed! pt-10 bg-background z-[90] !my-0 left-0! min-h-screen inset-0!'
        : 'pt-10',
    ]"
  >
    <ScrollAreaRoot
      class="w-full ScrollAreaRootCodeBlock h-full"
      style="--scrollbar-size: 10px"
    >
      <ScrollAreaViewport
        class="w-full"
        :class="showFullCode ? 'h-full' : 'max-h-[400px]'"
      >
        <div ref="codeHeight" spellcheck="false">
          <pre><code class="text-xs leading-6 break-all"><NodeViewContent /></code></pre>
        </div>
      </ScrollAreaViewport>
      <ScrollAreaScrollbar
        class="flex select-none z-20 touch-none p-0.5 ease-out data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
        orientation="vertical"
      >
        <ScrollAreaThumb
          class="flex-1 bg-secondary-foreground/30 ease-out hover:bg-primary/90 transition-colors rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]"
        />
      </ScrollAreaScrollbar>
    </ScrollAreaRoot>
    <div class="absolute flex justify-between left-0 top-0 right-0">
      <!-- Title Section -->
      <div class="sticky left-0 top-0 font-mono w-64">
        <div
          v-if="codeTitle || isEditingTitle"
          class="flex items-center w-full justify-between"
        >
          <!-- Title Display/Edit -->
          <div class="flex-1 w-full min-w-0 p-1 pr-0">
            <input
              v-if="isEditingTitle"
              ref="titleInput"
              v-model="titleInput"
              class="w-full h-8 bg-background focus:outline-primary font-normal px-1 text-xs border-none outline-1 focus:outline-1 text-primary"
              placeholder="Filename..."
              @blur="saveTitle"
              @keydown="handleTitleKeydown"
            >
            <button
              v-if="!isEditingTitle"
              class="text-xs font-normal h-8 px-1 hover:text-foreground transition-colors cursor-pointer truncate block w-full text-left"
              @click="startEditingTitle"
            >
              {{ codeTitle }}
            </button>
          </div>
        </div>
        <button
          v-else
          class="absolute top-0 w-64 text-left font-normal left-0 text-xs h-8 min-w-20 m-1 p-1 text-muted-foreground hover:text-foreground transition-colors bg-background py-1 border border-muted z-10"
          @click="startEditingTitle"
        >
          Filename...
        </button>
      </div>

      <div
        class="sticky w-64 codeBlockActions p-1 top-0 right-0 translate-x-0! flex items-center duration-100 justify-end gap-1"
        :class="showFullCode ? 'z-[91]' : 'z-30'"
      >
        <Transition mode="out-in">
          <span
            v-if="copyTextError"
            class="flex items-center justify-center duration-100 font-mono h-6 shrink-0 text-xs px-2 bg-primary/80 text-primary-foreground"
          >
            No text detected
          </span>
        </Transition>
        <ListboxVirtual v-model="selectedLanguage" :items="languages" />
        <button
          class="print:hidden flex items-center justify-center size-8 bg-secondary shrink-0"
          :class="copyText === 'Copied' ? 'bg-primary!' : ''"
          @click="copyToClipboard()"
        >
          <ClipboardCheck
            v-show="copyText === 'Copied'"
            class="size-5 text-primary-foreground"
          />
          <Clipboard v-show="copyText !== 'Copied'" class="size-5" />
          <span class="sr-only">Copy to clipboard</span>
        </button>
        <button
          class="flex items-center justify-center duration-100 size-8 bg-secondary shrink-0"
          :class="height > 388 || showFullCode ? '' : 'disabled pointer-events-none opacity-50 hidden'"
          @click="showFullCode = !showFullCode"
        >
          <Minimize2 v-if="showFullCode" class="size-5 pointer-events-none" />
          <Maximize v-else class="size-5 pointer-events-none" />
        </button>
      </div>
    </div>
  </NodeViewWrapper>
</template>

<style>
@reference "@/assets/main.css";

.tiptap .code-block {
  position: relative;
  margin: 1rem 0;
}

.tiptap .code-block [data-reka-scroll-area-viewport] {
  @apply duration-100 border border-primary/5 outline-none;
}

.tiptap .code-block [data-reka-scroll-area-viewport]:hover {
  @apply border border-primary/50;
}

.tiptap .code-block .codeBlockActions {
  @apply -translate-x-3;
}

.tiptap .code-block [data-reka-scroll-area-viewport]:focus,
.tiptap .code-block [data-reka-scroll-area-viewport]:focus-within {
  @apply ring-2 ring-primary;
}

.tiptap .code-block pre {
  @apply rounded-none;
}

.tiptap .code-block pre code div {
  @apply pt-4 p-3;
}

.tiptap .code-block pre code * {
  @apply !select-text;
}

.is-preview * {
  @apply !select-text;
}

@media print {
  .tiptap .code-block {
    @apply !ml-[0.1125rem];
  }

  .tiptap .code-block pre code div {
    @apply p-0;
  }

  .tiptap .code-block [data-reka-scroll-area-viewport] {
    @apply border ring-0! border-foreground/20! outline-none!;
  }

  .tiptap .code-block span {
    filter: brightness(0.5);
  }
}

/* we will explain what these classes do next! */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
