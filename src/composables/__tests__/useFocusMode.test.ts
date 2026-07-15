import { describe, expect, it } from 'vitest'
import { useFocusMode } from '../useFocusMode'

describe('useFocusMode', () => {
  it('starts with focus_mode off', () => {
    const { focus_mode } = useFocusMode()
    // Reset singleton state from any previous test
    focus_mode.value = false

    expect(focus_mode.value).toBe(false)
  })

  it('focusModeOn enables focus mode', () => {
    const { focus_mode, focusModeOn } = useFocusMode()
    focus_mode.value = false

    focusModeOn()
    expect(focus_mode.value).toBe(true)
  })

  it('focusModeOff disables focus mode', () => {
    const { focus_mode, focusModeOff } = useFocusMode()
    focus_mode.value = true

    focusModeOff()
    expect(focus_mode.value).toBe(false)
  })

  it('toggleFocusMode flips the value', () => {
    const { focus_mode, toggleFocusMode } = useFocusMode()
    focus_mode.value = false

    toggleFocusMode()
    expect(focus_mode.value).toBe(true)

    toggleFocusMode()
    expect(focus_mode.value).toBe(false)
  })

  it('returns the same singleton across calls', () => {
    const a = useFocusMode()
    const b = useFocusMode()

    expect(a.focus_mode).toBe(b.focus_mode)
  })
})
