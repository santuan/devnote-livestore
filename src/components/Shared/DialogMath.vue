<script setup lang="ts">
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
import { nextTick, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

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
  if (event.key === 'Enter') {
    event.preventDefault()
    handleConfirm()
  }
  else if (event.key === 'Escape') {
    event.preventDefault()
    handleCancel()
  }
}
</script>

<template>
  <DialogRoot :open="props.open" @update:open="emit('update:open', $event)">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-[904] bg-black/50" />
      <DialogContent
        class="fixed z-[905] w-[95vw] max-w-md rounded-lg p-4 md:w-full top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] bg-background text-foreground border border-secondary font-mono"
      >
        <DialogTitle class="text-sm font-semibold pr-12 mb-2">
          {{ props.title || 'Edit Math Expression' }}
        </DialogTitle>
        <DialogDescription class="text-xs text-muted-foreground mb-4">
          {{ props.description || 'Enter your LaTeX math expression:' }}
        </DialogDescription>

        <div class="space-y-4">
          <textarea
            ref="inputRef"
            v-model="inputValue"
            type="text"
            class="w-full px-3 py-2 text-sm border border-secondary rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="e.g., x^2 + y^2 = z^2"
            @keydown="handleKeydown"
          />

          <div class="flex justify-end gap-2">
            <button
              class="px-3 py-2 text-xs bg-secondary text-foreground hover:bg-secondary/80 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              @click="handleCancel"
            >
              {{ t('verb.cancel') }}
            </button>
            <button
              class="px-3 py-2 text-xs bg-primary text-primary-foreground hover:bg-primary/90 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
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
