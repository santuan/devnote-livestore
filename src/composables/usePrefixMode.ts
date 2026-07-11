import type { CommandId } from './useKeybindingConfig'
import { onUnmounted, ref } from 'vue'
import { useKeybindingConfig } from './useKeybindingConfig'

const isActive = ref(false)
const commandHandlers = new Map<CommandId, () => void>()

export function usePrefixMode() {
  const { prefixKey, getCommandForKey } = useKeybindingConfig()

  function activate() {
    isActive.value = true
  }

  function deactivate() {
    isActive.value = false
  }

  function onCommand(commandId: CommandId, handler: () => void) {
    commandHandlers.set(commandId, handler)
  }

  function offCommand(commandId: CommandId) {
    commandHandlers.delete(commandId)
  }

  function executeCommand(key: string): boolean {
    const commandId = getCommandForKey(key)
    if (!commandId)
      return false

    const handler = commandHandlers.get(commandId)
    if (handler) {
      handler()
      deactivate()
      return true
    }
    return false
  }

  function parseKeyCombo(combo: string): { key: string, ctrl: boolean, alt: boolean, shift: boolean, meta: boolean } {
    const parts = combo.toLowerCase().split('+')
    const rawKey = parts.find(p => !['ctrl', 'alt', 'shift', 'meta'].includes(p)) || ''
    const key = rawKey === 'space' ? ' ' : rawKey
    return {
      key,
      ctrl: parts.includes('ctrl'),
      alt: parts.includes('alt'),
      shift: parts.includes('shift'),
      meta: parts.includes('meta'),
    }
  }

  function matchesKeyCombo(event: KeyboardEvent, combo: string): boolean {
    const parsed = parseKeyCombo(combo)
    const eventKey = event.key

    return (
      eventKey.toLowerCase() === parsed.key
      && event.ctrlKey === parsed.ctrl
      && event.altKey === parsed.alt
      && event.shiftKey === parsed.shift
      && event.metaKey === parsed.meta
    )
  }

  // Global key handler
  const handleKeyDown = (event: KeyboardEvent) => {
    // Check if prefix key was pressed
    if (!isActive.value && matchesKeyCombo(event, prefixKey.value)) {
      event.preventDefault()
      event.stopPropagation()
      activate()
      return
    }

    // If in prefix mode, check for command key
    if (isActive.value) {
      // Escape always cancels prefix mode
      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        deactivate()
        return
      }

      // Skip modifier-only keys
      if (['Control', 'Alt', 'Shift', 'Meta'].includes(event.key))
        return

      event.preventDefault()
      event.stopPropagation()

      executeCommand(event.key)
    }
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeyDown, true)
  }

  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', handleKeyDown, true)
    }
  })

  return {
    isActive,
    activate,
    deactivate,
    onCommand,
    offCommand,
  }
}
