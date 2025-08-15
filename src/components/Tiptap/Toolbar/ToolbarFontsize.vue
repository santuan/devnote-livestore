<script setup lang="ts">
import type { Ref } from 'vue'
import { Check, ChevronDown, Minus, Plus } from 'lucide-vue-next'
import {
  DropdownMenuArrow,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemIndicator,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldRoot,
  ToolbarButton,
} from 'reka-ui'
import { inject, ref, watch } from 'vue'

const editor = inject('content') as Ref<any>

// Current font size value - this is our single source of truth
const fontSize = ref(16)

// Function to get current font size from editor
function getEditorFontSize() {
  if (!editor.value)
    return 16

  const currentStyle = editor.value.getAttributes('textStyle')
  const currentFontSize = currentStyle.fontSize

  if (!currentFontSize || currentFontSize === 'unset')
    return 16

  // Convert rem to px (assuming 1rem = 16px)
  if (currentFontSize.includes('rem')) {
    return Number.parseFloat(currentFontSize) * 16
  }

  // Handle px values
  if (currentFontSize.includes('px')) {
    return Number.parseFloat(currentFontSize)
  }

  // Handle unitless values (assume px)
  return Number.parseFloat(currentFontSize) || 16
}

// Function to apply font size to editor
function applyFontSizeToEditor(value: number) {
  if (!editor.value)
    return

  const remValue = value / 16

  if (value === 16) {
    // Use unset for base size
    editor.value.chain().focus().unsetFontSize().run()
  }
  else {
    editor.value.chain().focus().setFontSize(`${remValue}rem`).run()
  }
}

// Watch for external changes to editor and sync fontSize
watch(
  () => {
    if (!editor.value)
      return null
    return editor.value.getAttributes('textStyle').fontSize
  },
  () => {
    const editorSize = getEditorFontSize()
    if (editorSize !== fontSize.value) {
      fontSize.value = editorSize
    }
  },
  { immediate: true },
)

// Handle value changes from NumberField
function handleValueChange(value: number) {
  fontSize.value = value
  applyFontSizeToEditor(value)
}

const toggleState = ref(false)
</script>

<template>
  <div class="flex items-center gap-1 justify-start   w-full">
    <NumberFieldRoot
      :model-value="fontSize"
      :min="8"
      :max="80"
      :step="1"
      class="font-size-field"
      @update:model-value="handleValueChange"
    >
      <div class="flex items-center ">
        <NumberFieldDecrement class="interactive p-1.5 disabled:opacity-20">
          <Minus class="w-3 h-3" />
        </NumberFieldDecrement>
        <NumberFieldInput
          id="fontSize"
          class="bg-secondary w-12 border  border-secondary  h-8 tabular-nums text-center focus:outline-2 z-10 focus:outline-primary p-1 text-xs"
          placeholder="16"
        />

        <NumberFieldIncrement class="interactive p-1.5 disabled:opacity-20">
          <Plus class="w-3 h-3" />
        </NumberFieldIncrement>
        <DropdownMenuRoot v-model:open="toggleState">
          <ToolbarButton as-child>
            <DropdownMenuTrigger
              class=" inline-flex items-center min-w-12 text-xs! focus:outline-2 z-10 focus:outline-primary p-1  h-8 justify-center border  border-secondary text-secondary-foreground bg-background"
              aria-label="Select size"
            >
              <ChevronDown class="size-3" />
            </DropdownMenuTrigger>
          </ToolbarButton>

          <DropdownMenuPortal>
            <DropdownMenuContent
              class="min-w-24 uppercase text-center outline-none text-background-foreground border border-secondary bg-background rounded p-2 shadow"
              :side-offset="5"
              :side="'bottom'"
              :align="'end'"
            >
              <DropdownMenuItem
                :class="{
                  'is-active': editor.isActive('textStyle', {
                    fontSize: '.75rem',
                  }),
                }"
                data-test-id=".75rem"
                class="group text-xs leading-none text-primary font-mono rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-primary/20 data-[highlighted]:text-primary"
                @click="editor.chain().focus().setFontSize('.75rem').run()"
              >
                xs
              </DropdownMenuItem>
              <DropdownMenuItem
                :class="{
                  'is-active': editor.isActive('textStyle', {
                    fontSize: '0.875',
                  }),
                }"
                data-test-id="0.875"
                class="group text-xs leading-none text-primary font-mono rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-primary/20 data-[highlighted]:text-primary"
                @click="editor.chain().focus().setFontSize('0.875').run()"
              >
                sm
              </DropdownMenuItem>
              <DropdownMenuItem
                :class="{
                  'is-active': editor.isActive('textStyle', {
                    fontSize: 'unset',
                  }),
                }"
                data-test-id="unsetfontsize"
                class="group text-xs leading-none text-primary font-mono rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-primary/20 data-[highlighted]:text-primary"
                @select="editor.chain().focus().unsetFontSize().run()"
              >
                Base
                <DropdownMenuItemIndicator>
                  <Check class="size-3 text-primary" />
                </DropdownMenuItemIndicator>
                (Default)
              </DropdownMenuItem>
              <DropdownMenuItem
                :class="{
                  'is-active': editor.isActive('textStyle', {
                    fontSize: '1.125rem',
                  }),
                }"
                data-test-id="1.125rem"
                class="group text-xs leading-none text-primary font-mono rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-primary/20 data-[highlighted]:text-primary"
                @click="editor.chain().focus().setFontSize('1.125rem').run()"
              >
                lg
              </DropdownMenuItem>
              <DropdownMenuItem
                :class="{
                  'is-active': editor.isActive('textStyle', {
                    fontSize: '1.25rem',
                  }),
                }"
                data-test-id="1.25rem"
                class="group text-xs leading-none text-primary font-mono rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-primary/20 data-[highlighted]:text-primary"
                @click="editor.chain().focus().setFontSize('1.25rem').run()"
              >
                xl
              </DropdownMenuItem>
              <DropdownMenuItem
                :class="{
                  'is-active': editor.isActive('textStyle', {
                    fontSize: '1.5rem',
                  }),
                }"
                data-test-id="1.5rem"
                class="group text-xs leading-none text-primary font-mono rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-primary/20 data-[highlighted]:text-primary"
                @click="editor.chain().focus().setFontSize('1.5rem').run()"
              >
                2xl
              </DropdownMenuItem>
              <DropdownMenuItem
                :class="{
                  'is-active': editor.isActive('textStyle', {
                    fontSize: '1.875rem',
                  }),
                }"
                data-test-id="1.875rem"
                class="group text-xs leading-none text-primary font-mono rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-primary/20 data-[highlighted]:text-primary"
                @click="editor.chain().focus().setFontSize('1.875rem').run()"
              >
                3xl
              </DropdownMenuItem>
              <DropdownMenuItem
                :class="{
                  'is-active': editor.isActive('textStyle', {
                    fontSize: '2.25rem',
                  }),
                }"
                data-test-id="2.25rem"
                class="group text-xs leading-none text-primary font-mono rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-primary/20 data-[highlighted]:text-primary"
                @click="editor.chain().focus().setFontSize('2.25rem').run()"
              >
                4xl
              </DropdownMenuItem>
              <DropdownMenuItem
                :class="{
                  'is-active': editor.isActive('textStyle', {
                    fontSize: '3rem',
                  }),
                }"
                data-test-id="3rem"
                class="group text-xs leading-none text-primary font-mono rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-primary/20 data-[highlighted]:text-primary"
                @click="editor.chain().focus().setFontSize('3rem').run()"
              >
                5xl
              </DropdownMenuItem>
              <DropdownMenuItem
                :class="{
                  'is-active': editor.isActive('textStyle', {
                    fontSize: '3.5rem',
                  }),
                }"
                data-test-id="3.5rem"
                class="group text-xs leading-none text-primary font-mono rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-primary/20 data-[highlighted]:text-primary"
                @click="editor.chain().focus().setFontSize('3.5rem').run()"
              >
                6xl
              </DropdownMenuItem>
              <DropdownMenuArrow class="fill-secondary" />
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenuRoot>
      </div>
    </NumberFieldRoot>
  </div>
</template>

<style scoped>
.font-size-field {
  min-width: 80px;
}
</style>
