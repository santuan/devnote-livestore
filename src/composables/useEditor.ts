import type { Ref } from 'vue'
import { shallowRef } from 'vue'

// --- Shared singleton state ---
const editorRef = shallowRef<any>(null)
const toc = shallowRef<any>(null)

export function useEditor() {
  function focusEditor() {
    editorRef.value?.commands?.focus()
  }

  function focusTitle(inputRef: Ref<HTMLElement | null> | HTMLElement | null) {
    const el = inputRef && 'value' in inputRef ? inputRef.value : inputRef
    if (el instanceof HTMLElement) {
      el.focus()
    }
  }

  return {
    editorRef,
    toc,
    focusEditor,
    focusTitle,
  }
}
