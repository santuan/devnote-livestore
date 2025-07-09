<script setup lang="ts">
import type { Ref } from 'vue'
import Blockquote from '@tiptap/extension-blockquote'
import Bold from '@tiptap/extension-bold'
import BulletList from '@tiptap/extension-bullet-list'
import CharacterCount from '@tiptap/extension-character-count'
import Code from '@tiptap/extension-code'
import { Color } from '@tiptap/extension-color'
import Document from '@tiptap/extension-document'
import Gapcursor from '@tiptap/extension-gapcursor'
import HardBreak from '@tiptap/extension-hard-break'
import Heading from '@tiptap/extension-heading'
import History from '@tiptap/extension-history'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import Italic from '@tiptap/extension-italic'
import Link from '@tiptap/extension-link'
import ListItem from '@tiptap/extension-list-item'
import Mathematics from '@tiptap/extension-mathematics'
import OrderedList from '@tiptap/extension-ordered-list'
import Paragraph from '@tiptap/extension-paragraph'
import Placeholder from '@tiptap/extension-placeholder'
import Strike from '@tiptap/extension-strike'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import {
  getHierarchicalIndexes,
  TableOfContents,
} from '@tiptap/extension-table-of-contents'
import TableRow from '@tiptap/extension-table-row'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import Text from '@tiptap/extension-text'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import Typography from '@tiptap/extension-typography'
import Underline from '@tiptap/extension-underline'
import Youtube from '@tiptap/extension-youtube'
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
import WebFrame from './addIframe'
import Video from './addVideo'
import EditorCodeBlock from './EditorCodeBlock.vue'
import { ResizableMedia } from './resizableMedia'

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
const { editable } = useClientDocument(tables.uiState)

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
      Mathematics,
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
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      Placeholder.configure({ placeholder: t('editor.placeholder') }),
      Table.configure({ resizable: false, allowTableNodeSelection: true }),
      TaskItem.configure({ nested: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle.configure(),
      Youtube.configure({ controls: true, ccLanguage: 'es', nocookie: true }),
      TableOfContents.configure({
        getIndex: getHierarchicalIndexes,
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
    onCreate: () => { },
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
    v-if="editor" class="EditorTiptap @container " :class="[
      editable ? 'outline outline-primary' : '!outline-0',
    ]"
  >
    <div class="absolute left-0 right-0 top-0 h-8 bg-background border-b border-secondary flex justify-start p-1 z-40">
      <button
        :class="{ 'bg-primary text-primary-foreground': editor.isActive('codeBlock') }" class="interactive font-mono border border-primary  text-xs px-3 "
        value="Codeblock" @click="editor.chain().focus().toggleCodeBlock().run()"
      >
        Add Code Snippet
      </button>
    </div>
    <ScrollAreaRoot
      class="ScrollAreaEditor pt-6 group" :class="[
        toolbar ? 'with-toolbar' : '',
      ]" style="--scrollbar-size: 10px"
    >
      <ScrollAreaViewport
        id="editorScrollArea"
        class="w-full h-full border-transparent border outline-hidden group-focus-within:ring-primary! group-focus-within:ring-2! group-focus-within:ring-inset! focus:ring-primary! focus:ring-1!"
      >
        <div class="relative max-w-full mx-auto prose EditorContent dark:prose-invert" spellcheck="false">
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

<style>
@reference "@/assets/main.css";

.EditorTiptap {
  @apply grid w-full min-h-[50vh] relative pt-2;
}

/* .EditorTiptap .prose .tiptap {
  p:first-of-type {
    @apply mt-0;
  }
} */

[data-reka-scroll-area-viewport] {
  @apply print:overflow-y-visible! print:border-0!;
}

@media print {
  html {
    @apply !text-xs;
  }

  @page {
    @bottom-right {
      font-family: "JetBrains Mono Variable";
      margin: 0 0 10pt 0;
      font-size: 8pt;
      color: #333;
      content: counter(page) "-" counter(pages);
    }
  }

  h1+p,
  h2+p,
  h3+p {
    page-break-before: avoid;
  }

  [data-reka-scroll-area-viewport] {
    --secondary: 240 4.8% 90.9%;
    @apply overflow-y-visible! !border;
  }

  .tiptap td,
  .tiptap th {
    @apply border! !border-muted/20;
  }

  h2,
  h3,
  h4 {
    page-break-after: avoid;
  }

  pre,
  blockquote {
    page-break-inside: avoid;
  }
}

.ScrollAreaEditor {
  @apply w-full scrollbar-none border-0 print:h-full! print:max-h-none! overflow-x-hidden print:!overflow-y-auto;

  &.is-editable {
    @apply bg-background border border-secondary;
    height: calc(100dvh - var(--editorToolbar));

    .tiptap td,
    .tiptap th {
      @apply border-secondary/50 !border-4 p-0;
    }
  }

  /* &.with-toolbar {
    height: calc(100dvh - var(--editorToolbar));
  } */

  &.is-preview {
    /* height: calc(100dvh); */
    @apply max-h-screen bg-background min-h-[90dvh];

    .tiptap td,
    .tiptap th {
      @apply border-secondary/20 !border-4 p-0;
    }

    .ProseMirror-trailingBreak,
    .ProseMirror-separator {
      @apply !hidden;
    }
  }
}

.tiptap {
  @apply px-2 md:px-4 pb-12 md:pt-2 outline-hidden placeholder:text-primary min-h-[80vh];
  /* @apply font-mono font-normal; */
  @apply font-serif;
}

.tiptap p.is-editor-empty:first-child::before {
  @apply !text-foreground/25;
}

.tiptap h1,
.tiptap h2,
.tiptap h3,
.tiptap h4,
.tiptap h5,
.tiptap h6 {
  @apply scroll-mt-8;
}

.Tiptap-mathematics-editor {
  @apply bg-secondary text-foreground font-mono py-0.5 px-2 text-sm;
}

.Tiptap-mathematics-render {
  @apply py-0.5 px-2 text-sm;
}

.Tiptap-mathematics-editor,
.Tiptap-mathematics-render {
  border-radius: 0.25rem;
  display: inline-block;
}

.tiptap table:first-of-type,
.tiptap h1:first-of-type,
.tiptap h2:first-of-type,
.tiptap h3:first-of-type,
.tiptap h4:first-of-type,
.tiptap h5:first-of-type,
.tiptap h6:first-of-type {
  @apply mt-4;
}

.tiptap p a span {
  @apply !text-inherit;
}

.tiptap p {
  @apply break-words;
  hyphens: auto;
}

.tiptap p:has(img) {
  margin: 0;
}

.tiptap p:has(img) img {
  margin: 0;
}

.tiptap p a {
  @apply break-all underline-offset-4 decoration-dotted print:decoration-solid underline;
}

.tiptap pre {
  @apply my-0;
}

.tiptap p code {
  @apply bg-primary break-all px-1 mx-0.5 rounded py-0.5 text-primary-foreground ring-1 ring-primary/30 font-light text-sm;
  @apply print:bg-primary! print:rounded-none print:ring-0;
}

.tiptap code::after,
.tiptap code::before {
  display: none;
}

html.dark .shiki,
html.dark .shiki span {
  color: var(--shiki-dark) !important;
  background-color: var(--shiki-dark-bg) !important;
  /* Optional, if you also want font styles */
  font-style: var(--shiki-dark-font-style) !important;
  font-weight: var(--shiki-dark-font-weight) !important;
  text-decoration: var(--shiki-dark-text-decoration) !important;
}

.tiptap p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
  @apply text-foreground/50;
}

.iframeContainer {
  @apply w-full relative border! border-primary! grid ring-transparent bg-background;
}

.is-preview .iframeContainer {
  @apply pt-0!;
}

.is-preview .iframeContainer iframe {
  @apply h-[70vh] md:h-[77vh];
}

.iframeContainer iframe {
  @apply mx-auto h-[70vh] md:h-[77vh] relative w-full;
}

.iframeContainer .iframeControls {
  @apply flex justify-between w-full border-b border-secondary bg-background h-10 items-center z-20;
}

.iframeContainer .iframeTitle {
  @apply border-secondary border h-6 mr-auto top-1 px-2 font-mono font-normal block text-xs bg-background py-1 truncate w-56 sm:w-auto sm:max-w-xl;
}

.iframeContainer .iframeEditButton {
  @apply absolute right-1 md:right-10 flex items-center font-mono justify-center hover:bg-background size-8 bg-secondary rounded-none shrink-0;
}

.iframeContainer.fullscreen .iframeEditButton {
  display: none !important;
}

.iframeContainer .iframeFullscreenButton {
  @apply absolute hidden right-1 md:flex items-center font-mono justify-center hover:bg-background size-8 bg-secondary rounded-none;
}

.iframeContainer .iframeFullscreenButton svg {
  @apply pointer-events-none;
}

.iframeContainer:has(iframe[src*="youtube"]) {
  @apply pt-0 max-w-5xl mx-auto;

  .iframeEditButton {
    @apply right-1!;
  }

  .iframeFullscreenButton {
    @apply hidden;
  }

  iframe {
    @apply aspect-video h-[22rem];
  }
}

.iframeContainer.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 100vh;
  z-index: 200;
  background: black;
}

.iframeContainer.fullscreen iframe {
  width: 100%;
  height: 94vh;
}

.tiptap .ProseMirror-gapcursor {
  @apply w-0.5 h-6 bg-primary -translate-x-3;
}

.tiptap table {
  border-collapse: collapse;
  margin: 0;
  overflow: hidden;
  table-layout: fixed;
  width: 100%;
}

.tiptap td,
.tiptap th {
  @apply border border-muted;
  box-sizing: border-box;
  min-width: 1em;
  padding: 6px 8px;
  position: relative;
  vertical-align: top;
}

.tiptap th {
  background-color: var(--gray-1);
  font-weight: bold;
  text-align: left;
}

.tiptap .selectedCell:after {
  @apply bg-primary/20 ring-1 ring-primary/50;
  content: "";
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  pointer-events: none;
  position: absolute;
  z-index: 2;
}

.tiptap .tableWrapper {
  margin: 1.5rem 0;
  overflow-x: auto;
}

.tiptap table iframe {
  @apply w-full max-w-full;
}

.tiptap.resize-cursor {
  cursor: ew-resize;
  cursor: col-resize;
}

.tiptap .ProseMirror-selectednode {
  @apply ring-2 ring-primary border-secondary/5 border-2;
}

.is-editable .tiptap .media-node-view {
  @apply border-primary/5 border-2 bg-primary/[0.0005];
}

.is-editable .tiptap .media-node-view.ProseMirror-selectednode {
  @apply ring-0! ring-transparent! bg-primary/[0.02] border-2 border-primary border-dashed;
}

.tiptap li p {
  @apply m-0;
}

.tiptap ul[data-type="taskList"] {
  list-style: none;
  margin-left: 0;
  padding: 0;
}

.tiptap ul[data-type="taskList"] li {
  align-items: flex-start;
  display: flex;
}

.tiptap ul[data-type="taskList"] label {
  flex: 0 0 auto;
  margin-right: 0.5rem;
  user-select: none;
}

.tiptap ul[data-type="taskList"]>div {
  flex: 1 1 auto;
}

.tiptap ul[data-type="taskList"] {
  margin: 0;
}

.tiptap ul[data-type="taskList"] li[data-checked] input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  /* cursor: pointer; */
  height: 0;
  width: 0;
}

.tiptap ul[data-type="taskList"] li:focus-within span {
  @apply outline-2! border-primary;
}

.tiptap ul[data-type="taskList"] li[data-checked] label span {
  position: relative;
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 10px;
  @apply bg-primary/10 border-primary/50 border-2 -translate-y-px;
  vertical-align: middle;
}

.tiptap ul[data-type="taskList"] li[data-checked="true"] label span {
  @apply bg-primary border-primary;
}

.ScrollAreaEditor.is-editable ul[data-type="taskList"] li[data-checked]:hover label span {
  @apply bg-primary border-primary;
}

.ScrollAreaEditor.is-preview ul[data-type="taskList"] li[data-checked] {
  @apply pointer-events-none;
}

.tiptap ul[data-type="taskList"] li[data-checked="true"] label span::after {
  content: "";
  position: absolute;
  display: block;
  left: 50%;
  top: 50%;
  width: 12px;
  height: 12px;
  transform: translate(-50%, -50%);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'%3E%3C/polyline%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.dark .tiptap ul[data-type="taskList"] li[data-checked="true"] label span::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'%3E%3C/polyline%3E%3C/svg%3E");
}

.tiptap ul[data-type="taskList"] li[data-checked] {
  display: flex;
  align-items: flex-start;
  margin-bottom: 8px;
}

.tiptap ul[data-type="taskList"] li[data-checked] div {
  flex: 1;
}
</style>
