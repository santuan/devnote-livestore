<script setup lang="ts">
import katex from 'katex'
import { X } from 'lucide-vue-next'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from 'reka-ui'
import { computed, nextTick, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Tooltip from './Tooltip.vue'

const props = defineProps<{
  open: boolean
  initialValue?: string
  title?: string
  description?: string
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'confirm', value: string): void
  (e: 'cancel'): void
}>()

const { t } = useI18n()
const inputValue = ref('')
const inputRef = ref<HTMLInputElement | null>(null)
const quickFormulas = [
  { label: 'Fraction', formula: '\\frac{a}{b}' },
  { label: 'Square Root', formula: '\\sqrt{x}' },
  { label: 'Power', formula: 'x^{n}' },
  { label: 'Subscript', formula: 'x_{n}' },
  { label: 'Sum', formula: '\\sum_{i=1}^{n} x_i' },
  { label: 'Integral', formula: '\\int_{a}^{b} f(x) dx' },
  { label: 'Limit', formula: '\\lim_{x \\to \\infty} f(x)' },
  { label: 'Matrix', formula: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}' },
  { label: 'Greek α', formula: '\\alpha' },
  { label: 'Greek β', formula: '\\beta' },
  { label: 'Greek π', formula: '\\pi' },
  { label: 'Greek Σ', formula: '\\Sigma' },
  { label: 'Infinity', formula: '\\infty' },
  { label: 'Plus/Minus', formula: '\\pm' },
  { label: 'Not Equal', formula: '\\neq' },
  { label: 'Less/Equal', formula: '\\leq' },
  { label: 'Greater/Equal', formula: '\\geq' },
  { label: 'Approximately', formula: '\\approx' },
  { label: 'Partial Derivative', formula: '\\frac{\\partial f}{\\partial x}' },
  { label: 'Binomial', formula: '\\binom{n}{k}' },
  { label: 'Vector', formula: '\\vec{v}' },
  { label: 'Hat', formula: '\\hat{x}' },
  { label: 'Overline', formula: '\\overline{AB}' },
  { label: 'Therefore', formula: '\\therefore' },
]

// Function to render formula preview
function renderFormulaPreview(formula: string) {
  try {
    return katex.renderToString(formula, {
      throwOnError: false,
      displayMode: false,
      errorColor: '#cc0000',
    })
  }
  catch {
    return formula
  }
}

// KaTeX preview computation
const katexPreview = computed(() => {
  if (!inputValue.value.trim()) {
    return { html: '', error: null }
  }

  try {
    const html = katex.renderToString(inputValue.value, {
      throwOnError: false,
      displayMode: true,
      errorColor: '#cc0000',
    })
    return { html, error: null }
  }
  catch (error) {
    return {
      html: '',
      error: error instanceof Error ? error.message : 'Invalid LaTeX syntax',
    }
  }
})

watch(() => props.open, async (isOpen) => {
  if (isOpen) {
    inputValue.value = props.initialValue || ''
    await nextTick()
    inputRef.value?.focus()
    inputRef.value?.select()
  }
})

function handleConfirm() {
  emit('confirm', inputValue.value)
  emit('update:open', false)
}

function handleCancel() {
  emit('cancel')
  emit('update:open', false)
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
    event.preventDefault()
    handleConfirm()
  }
  else if (event.key === 'Escape') {
    event.preventDefault()
    handleCancel()
  }
}

function insertFormula(formula: string) {
  if (!inputRef.value)
    return

  const textarea = inputRef.value
  const start = textarea.selectionStart ?? 0
  const end = textarea.selectionEnd ?? 0
  const currentValue = inputValue.value

  // Insert formula at cursor position
  const newValue = currentValue.substring(0, start) + formula + currentValue.substring(end)
  inputValue.value = newValue

  // Set cursor position after inserted formula
  nextTick(() => {
    textarea.focus()
    textarea.setSelectionRange(start + formula.length, start + formula.length)
  })
}
</script>

<template>
  <DialogRoot :open="props.open" @update:open="emit('update:open', $event)">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-[904] bg-black/50" />
      <DialogContent
        class="fixed z-[905] w-[95vw] max-w-4xl rounded-lg p-4 md:w-full top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] bg-background text-foreground border border-secondary font-mono max-h-[90vh] overflow-y-auto"
      >
        <DialogTitle class="text-sm font-semibold pr-12 mb-2">
          {{ props.title || 'Edit Math Expression' }}
        </DialogTitle>
        <DialogDescription class="text-xs text-muted-foreground mb-4">
          {{ props.description || 'Enter your LaTeX math expression:' }}
        </DialogDescription>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <!-- Left column: Input and quick formulas -->
          <div class="space-y-4">
            <!-- Quick Formula Buttons -->
            <div class="space-y-2">
              <label class="text-xs font-medium text-foreground">LaTeX Expression:</label>
              <textarea
                ref="inputRef"
                v-model="inputValue"
                rows="6"
                class="w-full px-3 py-2 text-sm border border-secondary rounded bg-background text-foreground focus:outline-none focus:ring-2 resize-none focus:ring-primary focus:border-transparent font-mono min-h-[200px] max-h-[200px]"
                placeholder="e.g., x^2 + y^2 = z^2"
                @keydown="handleKeydown"
              />
            </div>
          </div>

          <!-- Right column: Preview -->
          <div class="space-y-2">
            <label class="text-xs font-medium text-foreground">Preview:</label>
            <div class="border border-secondary max-w-full rounded overflow-auto p-4 bg-background min-h-[200px] flex items-center justify-center">
              <div v-if="!inputValue.trim()" class="text-muted-foreground text-sm italic">
                Enter a LaTeX expression to see preview
              </div>
              <div v-else-if="katexPreview.error" class="text-red-500 text-sm">
                <div class="font-medium mb-1">
                  Error:
                </div>
                <div class="text-xs">
                  {{ katexPreview.error }}
                </div>
              </div>
              <div
                v-else
                class="katex-preview break-all  text-foreground"
                v-html="katexPreview.html"
              />
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-xs font-medium text-foreground">Quick Formulas:</label>
          <div class="grid grid-cols-8 gap-1 max-h-32 overflow-y-auto border border-secondary rounded p-2">
            <Tooltip v-for="formula in quickFormulas" :key="formula.label" side="top" :name="formula.label">
              <button
                type="button"
                class="text-xs px-2 py-1 bg-secondary hover:bg-secondary/80 text-foreground rounded text-center truncate focus:outline-none focus:ring-1 focus:ring-primary"
                @click="insertFormula(formula.formula)"
              >
                <div class="sr-only text-xs font-medium text-center">
                  {{ formula.label }}
                </div>

                <div
                  class="katex-button-preview flex-1 flex text-base items-center justify-center"
                  v-html="renderFormulaPreview(formula.formula)"
                />
              </button>
            </Tooltip>
          </div>
        </div>

        <div class="flex justify-between items-center gap-2 mt-4">
          <p class="text-xs text-muted-foreground">
            Press Ctrl+Enter (Cmd+Enter on Mac) to confirm, Esc to cancel
          </p>
          <div class="flex justify-end gap-2">
            <button
              class="px-3 py-2 text-xs bg-secondary text-foreground hover:bg-secondary/80 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              @click="handleCancel"
            >
              {{ t('verb.cancel') }}
            </button>
            <button
              class="px-3 py-2 text-xs bg-primary text-primary-foreground hover:bg-primary/90 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              :disabled="!!katexPreview.error"
              @click="handleConfirm"
            >
              {{ t('verb.save') }}
            </button>
          </div>
        </div>

        <DialogClose
          class="absolute top-0 size-6 flex justify-center items-center m-3 right-0 z-999 text-foreground hover:bg-secondary rounded"
          @click="handleCancel"
        >
          <X class="size-4" />
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<style scoped>
/* Ensure KaTeX renders with proper styling */
:deep(.katex-preview) {
  font-size: 1.2em;
}

:deep(.katex-display) {
  margin: 0;
}

/* Handle dark mode for KaTeX if needed */
:deep(.katex) {
  color: inherit;
}

/* Styling for formula buttons */
:deep(.katex-button-preview .katex) {
  font-size: 0.9em;
  color: inherit;
}

:deep(.katex-button-preview .katex-display) {
  margin: 0;
  text-align: center;
}
</style>
