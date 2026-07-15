<script lang="ts">
import type { Document } from '@/livestore/document'
import { TextSelection } from '@tiptap/pm/state'

import { defineComponent } from 'vue'
import ToCItem from './EditorTocItem.vue'

export default defineComponent({
  components: {
    ToCItem,
  },
  props: {
    items: {
      type: Array as () => Document[],
      default: () => [],
    },
    editor: {
      type: Object,
    },
  },

  methods: {
    onItemClick(_e: any, id: any) {
      if (this.editor && this.editor.view && this.editor.view.dom) {
        const element = this.editor.view.dom.querySelector(
          `[data-toc-id="${id}"`,
        )
        if (!element) return
        const pos = this.editor.view.posAtDOM(element, 0)
        // set focus
        const tr = this.editor.view.state.tr
        tr.setSelection(new TextSelection(tr.doc.resolve(pos)))
        this.editor.view.dispatch(tr)
        this.editor.view.focus()
        if (history.pushState) {
          history.pushState(null, '', `#${id}`)
        }
        const scrollContainer = document.getElementById('editorScrollArea')
        if (scrollContainer && element) {
          const containerRect = scrollContainer.getBoundingClientRect()
          const elementRect = element.getBoundingClientRect()
          const scrollTop
            = elementRect.top
              - containerRect.top
              + scrollContainer.scrollTop
              - 20
          scrollContainer.scrollTo({
            top: scrollTop,
            behavior: 'smooth',
          })
        }
      }
    },
  },
})
</script>

<template>
  <template v-if="!items || items.length === 0">
    <div class="w-full justify-center p items-center flex text-secondary-foreground  min-h-12 p-1">
      <div class="empty-state">
        <p class=" text-xs">
          Start editing your document to see the outline.
        </p>
      </div>
    </div>
  </template>
  <template v-else>
    <div class="pb-5">
      <ToCItem
        v-for="(item, i) in items"
        :key="item.id"
        :item="item"
        :index="i + 1"
        @item-click="onItemClick"
      />
    </div>
  </template>
</template>
