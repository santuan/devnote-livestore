import type { Ref } from 'vue'
import { isRef, shallowRef } from 'vue'

// --- Shared singleton state ---
const editorRef = shallowRef<any>(null)
const toc = shallowRef<any>(null)

export function useEditor() {
  function focusEditor() {
    if (editorRef.value?.view?.dom && !editorRef.value.isDestroyed) {
      editorRef.value.commands.focus()
    }
  }

  function focusTitle(inputRef: Ref<HTMLElement | null> | HTMLElement | null) {
    const el = inputRef && isRef(inputRef) ? inputRef.value : inputRef
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
