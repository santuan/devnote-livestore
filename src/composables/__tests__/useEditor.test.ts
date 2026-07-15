import { beforeEach, describe, expect, it, vi } from 'vitest'

const { useEditor } = await import('../useEditor')

describe('useEditor', () => {
  beforeEach(() => {
    const { editorRef } = useEditor()
    editorRef.value = null
  })

  it('starts with editorRef null', () => {
    const { editorRef } = useEditor()
    expect(editorRef.value).toBeNull()
  })

  it('starts with toc null', () => {
    const { toc } = useEditor()
    expect(toc.value).toBeNull()
  })

  it('focusEditor calls commands.focus on the editor', () => {
    const { editorRef, focusEditor } = useEditor()
    const mockFocus = vi.fn()
    editorRef.value = { commands: { focus: mockFocus } }

    focusEditor()
    expect(mockFocus).toHaveBeenCalled()
  })

  it('focusEditor does nothing when editor is null', () => {
    const { focusEditor } = useEditor()
    expect(() => focusEditor()).not.toThrow()
  })

  it('focusTitle focuses a raw HTMLElement', () => {
    const { focusTitle } = useEditor()
    const el = document.createElement('div')
    const spy = vi.spyOn(el, 'focus')

    focusTitle(el)
    expect(spy).toHaveBeenCalled()
  })

  it('focusTitle focuses through a Ref<HTMLElement>', () => {
    const { focusTitle } = useEditor()
    const el = document.createElement('textarea')
    const spy = vi.spyOn(el, 'focus')
    const ref = { value: el }

    focusTitle(ref as any)
    expect(spy).toHaveBeenCalled()
  })

  it('focusTitle does nothing for null ref', () => {
    const { focusTitle } = useEditor()
    const ref = { value: null }

    expect(() => focusTitle(ref as any)).not.toThrow()
  })

  it('returns the same singleton across calls', () => {
    const a = useEditor()
    const b = useEditor()

    expect(a.editorRef).toBe(b.editorRef)
    expect(a.toc).toBe(b.toc)
  })
})
