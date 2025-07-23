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
      if (this.editor) {
        const element = this.editor.view.dom.querySelector(
          `[data-toc-id="${id}"`,
        )
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
  <template v-if="items.length === 0">
    <div class="w-full justify-center items-center flex text-secondary-foreground border border-secondary min-h-20 p-3">
      <span>Empty</span>
    </div>
  </template>
  <template v-else>
    <div class="py-2">
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
