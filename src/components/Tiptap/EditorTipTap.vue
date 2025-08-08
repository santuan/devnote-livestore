<script setup lang="ts">
import type { Ref } from 'vue'
import Blockquote from '@tiptap/extension-blockquote'

import Bold from '@tiptap/extension-bold'
import Code from '@tiptap/extension-code'
import Document from '@tiptap/extension-document'
import HardBreak from '@tiptap/extension-hard-break'
import Heading from '@tiptap/extension-heading'
import History from '@tiptap/extension-history'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import Italic from '@tiptap/extension-italic'
import Link from '@tiptap/extension-link'
import {
  BulletList,
  ListItem,
  OrderedList,
  TaskItem,
  TaskList,
} from '@tiptap/extension-list'
import { Mathematics, migrateMathStrings } from '@tiptap/extension-mathematics'
import Paragraph from '@tiptap/extension-paragraph'
import Strike from '@tiptap/extension-strike'
import {
  Table,
  TableCell,
  TableHeader,
  TableRow,
} from '@tiptap/extension-table'
import {
  getHierarchicalIndexes,
  TableOfContents,
} from '@tiptap/extension-table-of-contents'
import Text from '@tiptap/extension-text'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyleKit } from '@tiptap/extension-text-style'
import Typography from '@tiptap/extension-typography'

import Underline from '@tiptap/extension-underline'
import Youtube from '@tiptap/extension-youtube'
import { CharacterCount, Gapcursor, Placeholder } from '@tiptap/extensions'

import { Editor, EditorContent, VueNodeViewRenderer } from '@tiptap/vue-3'
import {
  ScrollAreaRoot,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from 'reka-ui'
import CodeBlockShiki from 'tiptap-extension-code-block-shiki'
import { inject, onBeforeUnmount, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useClientDocument } from 'vue-livestore'
import { tables } from '@/livestore/schema'
import WebFrame from './EditorAddIframe'
import Video from './EditorAddVideo'
import EditorCodeBlock from './EditorCodeBlock.vue'
import { ResizableMedia } from './ResizableMedia'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  toolbar: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['update:modelValue'])
const { editable, newDocumentTitle } = useClientDocument(tables.uiState)

const editor = inject('content') as Ref<Editor>
const toc = inject('toc') as Ref<object | null>

const { t } = useI18n()

onMounted(() => {
  editor.value = new Editor({
    extensions: [
      Blockquote,
      Bold,
      BulletList,
      Code,
      Document,
      Gapcursor,
      HardBreak,
      Heading,
      History,
      HorizontalRule,
      Italic,
      ListItem,
      Mathematics.configure({
        blockOptions: {
          onClick: (node, pos) => {
            // eslint-disable-next-line no-alert
            const newCalculation = prompt('Enter new calculation:', node.attrs.latex)
            if (newCalculation) {
              editor.value.chain().setNodeSelection(pos).updateBlockMath({ latex: newCalculation }).focus().run()
            }
          },
        },
        inlineOptions: {
          onClick: (node, pos) => {
            // eslint-disable-next-line no-alert
            const katex = prompt('Enter new calculation:', node.attrs.latex)
            if (katex) {
              editor.value.chain().setNodeSelection(pos).updateInlineMath({ latex: katex }).focus().run()
            }
          },
        },
        katexOptions: {
          throwOnError: false,
          macros: {
            '\\R': '\\mathbb{R}',
            '\\N': '\\mathbb{N}',
          },
        },

      }),
      OrderedList,
      Paragraph,
      ResizableMedia,
      Strike,
      TableCell,
      TableHeader,
      TableRow,
      TaskList,
      Text,
      Typography,
      Underline,
      Video,
      WebFrame,
      // Custom extensions
      CharacterCount.configure({ limit: 50000 }),
      Placeholder.configure({ placeholder: t('editor.placeholder') }),
      Table.configure({ resizable: false, allowTableNodeSelection: true }),
      TaskItem.configure({ nested: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyleKit.configure({
        backgroundColor: {
          types: ['textStyle'],
        },
        color: {
          types: ['textStyle'],
        },
        fontFamily: {
          types: ['textStyle'],
        },
        fontSize: {
          types: ['textStyle'],
        },
        lineHeight: {
          types: ['textStyle'],
        },
      }),
      Youtube.configure({ controls: true, ccLanguage: 'es', nocookie: true }),
      TableOfContents.configure({
        getIndex: getHierarchicalIndexes,
        scrollParent: () => {
          const scrollArea = document.getElementById('editorScrollArea')
          if (scrollArea) {
            return scrollArea
          }
          return window
        },
        onUpdate: (content: any) => {
          toc.value = content
        },
      }),
      Link.configure({
        openOnClick: true,
        defaultProtocol: 'https',
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener',
          class:
            'px-1 underline-offset-2 text-primary cursor-pointer hover:text-primary/80',
        },
      }),
      CodeBlockShiki.extend({
        addNodeView() {
          return VueNodeViewRenderer(EditorCodeBlock)
        },
      }).configure({
        HTMLAttributes: {
          spellcheck: 'false',
        },
        defaultTheme: 'houston',
      }),
    ],
    content: props.modelValue,
    editable: editable.value,
    onCreate: ({ editor: currentEditor }) => {
      migrateMathStrings(currentEditor)
    },
    onUpdate: () => {
      emit('update:modelValue', editor.value.getHTML())
    },
  })
})

onBeforeUnmount(() => {
  editor.value.destroy()
})
</script>

<template>
  <div
    v-if="editor"
    class="EditorTiptap @container"
    :class="[editable ? 'outline outline-primary' : '!outline-0']"
  >
    <ScrollAreaRoot
      class="ScrollAreaEditor group"
      :class="[toolbar ? 'with-toolbar' : '', editable ? '' : '']"
      style="--scrollbar-size: 10px"
    >
      <ScrollAreaViewport
        id="editorScrollArea"
        class="w-full h-full border-transparent border outline-hidden group-focus-within:ring-primary! group-focus-within:ring-2! group-focus-within:ring-inset! focus:ring-primary! focus:ring-1!"
      >
        <h1
          v-if="!editable"
          class="text-3xl mt-3 font-serif font-semibold px-5"
        >
          {{ newDocumentTitle }}
        </h1>
        <div
          class="relative max-w-full mx-auto prose EditorContent dark:prose-invert"
          spellcheck="false"
        >
          <EditorContent :editor="editor" />
        </div>
      </ScrollAreaViewport>
      <ScrollAreaScrollbar
        class="print:hidden! flex select-none touch-none p-0.5 ease-out data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
        orientation="vertical"
      >
        <ScrollAreaThumb
          class="flex-1 bg-secondary-foreground/30 ease-out transition-colors hover:bg-primary/90 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]"
        />
      </ScrollAreaScrollbar>
    </ScrollAreaRoot>
  </div>
</template>
