import { describe, expect, it, vi, beforeEach } from 'vitest'
import { nextTick } from 'vue'

// Mock useSidebarCollapse — no external deps, just Vue reactivity
const { useSidebarCollapse } = await import('../useSidebarCollapse')

describe('useSidebarCollapse', () => {
  beforeEach(() => {
    const { showDocuments, sidebar_documents_splitter_ref, sidebar_secondary_splitter_ref } = useSidebarCollapse()
    showDocuments.value = true
    sidebar_documents_splitter_ref.value = null
    sidebar_secondary_splitter_ref.value = null
  })

  it('showDocuments defaults to true', () => {
    const { showDocuments } = useSidebarCollapse()
    expect(showDocuments.value).toBe(true)
  })

  it('toggle_documents flips showDocuments', () => {
    const { showDocuments, toggle_documents } = useSidebarCollapse()
    showDocuments.value = true

    toggle_documents()
    expect(showDocuments.value).toBe(false)

    toggle_documents()
    expect(showDocuments.value).toBe(true)
  })

  it('hide_panel_left sets showDocuments to false', () => {
    const { showDocuments, hide_panel_left } = useSidebarCollapse()
    showDocuments.value = true

    hide_panel_left()
    expect(showDocuments.value).toBe(false)
  })

  it('collapseSecondarySidebar calls collapse on the splitter', () => {
    const { sidebar_secondary_splitter_ref, collapseSecondarySidebar } = useSidebarCollapse()
    const mockCollapse = vi.fn()
    sidebar_secondary_splitter_ref.value = { collapse: mockCollapse }

    collapseSecondarySidebar()
    expect(mockCollapse).toHaveBeenCalled()
  })

  it('collapseSecondarySidebar does nothing when ref is null', () => {
    const { collapseSecondarySidebar } = useSidebarCollapse()
    expect(() => collapseSecondarySidebar()).not.toThrow()
  })

  it('expandSecondarySidebar calls resize(20) on the splitter', () => {
    const { sidebar_secondary_splitter_ref, expandSecondarySidebar } = useSidebarCollapse()
    const mockResize = vi.fn()
    sidebar_secondary_splitter_ref.value = { resize: mockResize }

    expandSecondarySidebar()
    expect(mockResize).toHaveBeenCalledWith(20)
  })

  it('returns the same singleton across calls', () => {
    const a = useSidebarCollapse()
    const b = useSidebarCollapse()
    expect(a.showDocuments).toBe(b.showDocuments)
  })
})
