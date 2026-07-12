import type { Ref } from 'vue'
import { onBeforeUnmount, onMounted, shallowRef } from 'vue'

export interface SplitterPairingOptions {
  /** Ref to the left splitter panel (sidebar documents) */
  leftSplitter: Ref<any>
  /** Ref to the right splitter panel (sidebar secondary) */
  rightSplitter: Ref<any>
}

export function useSplitterPairing({ leftSplitter, rightSplitter }: SplitterPairingOptions) {
  // --- Core state ---
  const pairingActive = shallowRef(false)
  const pairingHandle = shallowRef<'left' | 'right' | null>(null)
  const isAltPressed = shallowRef(false)
  const isDragging = shallowRef(false)
  const activeDragHandle = shallowRef<'left' | 'right' | null>(null)
  const layout = shallowRef<number[]>([0, 0])

  // --- Handle identification ---
  // @pointerdown fires BEFORE @layout, so we always know which handle is active
  function onHandlePointerDown(handle: 'left' | 'right') {
    activeDragHandle.value = handle
  }

  // @dragging fires AFTER @layout on first move, but we still track it
  // for the alt-release-during-drag protection
  function onHandleDragging(_handle: 'left' | 'right', dragging: boolean) {
    isDragging.value = dragging
    if (!dragging) {
      activeDragHandle.value = null
    }
  }

  // --- Layout change handler (core pairing logic) ---
  function onLayoutChange(newLayout: number[]) {
    layout.value = newLayout

    const shouldPair = isAltPressed.value || pairingActive.value
    if (!shouldPair) {
      return
    }

    const leftSize = newLayout[0]
    const rightSize = newLayout[2]

    if (leftSize === rightSize) {
      return
    }

    // Right-click pairing: use the handle that was right-clicked
    // Alt-held pairing: use the handle detected by @pointerdown
    const dragging = pairingActive.value ? pairingHandle.value : activeDragHandle.value

    if (dragging === 'right') {
      // User drags right handle → resize left panel to match
      leftSplitter.value?.resize(rightSize)
    }
    else if (dragging === 'left') {
      // User drags left handle → resize right panel to match
      rightSplitter.value?.resize(leftSize)
    }
  }

  // --- Context menu (right-click pairing) ---
  function onContextMenu(event: MouseEvent, handle: 'left' | 'right') {
    event.preventDefault()
    pairingActive.value = true
    pairingHandle.value = handle
    isAltPressed.value = true
  }

  // --- Deactivation ---
  function deactivatePairing() {
    pairingActive.value = false
    pairingHandle.value = null
    isAltPressed.value = false
  }

  // --- Event listeners ---
  onMounted(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Alt') {
        isAltPressed.value = true
      }
      if (event.key === 'Escape' && pairingActive.value) {
        deactivatePairing()
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'Alt') {
        // Don't break pairing during an active drag — user didn't intend to stop
        if (!isDragging.value) {
          isAltPressed.value = false
        }
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.resize-handle') && pairingActive.value) {
        deactivatePairing()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('click', handleClickOutside)

    onBeforeUnmount(() => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('click', handleClickOutside)
    })
  })

  return {
    /** Whether pairing mode is active (via right-click or alt-held) */
    pairingActive,
    /** Which handle initiated right-click pairing */
    pairingHandle,
    /** Whether Alt key is currently held */
    isAltPressed,
    /** Current splitter layout [left, center, right] */
    layout,
    /** Bind to SplitterGroup @layout */
    onLayoutChange,
    /** Bind to SplitterResizeHandle @contextmenu */
    onContextMenu,
    /** Bind to SplitterResizeHandle @pointerdown — identifies which handle */
    onHandlePointerDown,
    /** Bind to SplitterResizeHandle @dragging — tracks drag state */
    onHandleDragging,
  }
}
