import { describe, expect, it, vi } from 'vitest'

// Mock useSidebarCollapse before importing useLayoutPresets
const mockSplitterLeft = { resize: vi.fn() }
const mockSplitterRight = { resize: vi.fn() }

vi.mock('../useSidebarCollapse', () => ({
  useSidebarCollapse: () => ({
    sidebar_documents_splitter_ref: { value: mockSplitterLeft },
    sidebar_secondary_splitter_ref: { value: mockSplitterRight },
    collapseSecondarySidebar: vi.fn(),
    expandSecondarySidebar: vi.fn(),
  }),
}))

const { useLayoutPresets } = await import('../useLayoutPresets')

describe('useLayoutPresets', () => {
  it('initializes layout as [0, 0]', () => {
    const { layout } = useLayoutPresets()
    expect(layout.value).toEqual([0, 0])
  })

  it('onLayoutChange updates layout', () => {
    const { layout, onLayoutChange } = useLayoutPresets()

    onLayoutChange([25, 50, 25])
    expect(layout.value).toEqual([25, 50, 25])
  })

  it('applyPreset resizes splitters for layout1', () => {
    const { onLayoutChange, applyPreset } = useLayoutPresets()
    mockSplitterLeft.resize.mockClear()
    mockSplitterRight.resize.mockClear()

    onLayoutChange([25, 50, 25]) // non-zero to pass guard
    applyPreset('layout1')

    expect(mockSplitterLeft.resize).toHaveBeenCalledWith(30)
    expect(mockSplitterRight.resize).toHaveBeenCalledWith(30)
  })

  it('applyPreset resizes splitters for layout3', () => {
    const { onLayoutChange, applyPreset } = useLayoutPresets()
    mockSplitterLeft.resize.mockClear()
    mockSplitterRight.resize.mockClear()

    onLayoutChange([25, 50, 25])
    applyPreset('layout3')

    expect(mockSplitterLeft.resize).toHaveBeenCalledWith(5)
    expect(mockSplitterRight.resize).toHaveBeenCalledWith(50)
  })

  it('applyPreset does nothing if layout is null', () => {
    const { layout, applyPreset } = useLayoutPresets()
    layout.value = null as any

    mockSplitterLeft.resize.mockClear()
    mockSplitterRight.resize.mockClear()

    applyPreset('layout1')

    expect(mockSplitterLeft.resize).not.toHaveBeenCalled()
    expect(mockSplitterRight.resize).not.toHaveBeenCalled()
  })

  it('applyPreset does nothing for unknown preset id', () => {
    const { onLayoutChange, applyPreset } = useLayoutPresets()
    mockSplitterLeft.resize.mockClear()
    mockSplitterRight.resize.mockClear()

    onLayoutChange([25, 50, 25])
    applyPreset('nonexistent')

    expect(mockSplitterLeft.resize).not.toHaveBeenCalled()
    expect(mockSplitterRight.resize).not.toHaveBeenCalled()
  })
})
