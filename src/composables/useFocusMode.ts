import { shallowRef } from 'vue'

// --- Shared singleton state ---
const focus_mode = shallowRef(false)

export function useFocusMode() {
  function focusModeOn() {
    focus_mode.value = true
  }

  function focusModeOff() {
    focus_mode.value = false
  }

  function toggleFocusMode() {
    focus_mode.value = !focus_mode.value
  }

  return {
    focus_mode,
    focusModeOn,
    focusModeOff,
    toggleFocusMode,
  }
}
