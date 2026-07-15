import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Mock localStorage before importing the composable
const storage = new Map<string, string>()
const localStorageMock = {
  getItem: vi.fn((key: string) => storage.get(key) ?? null),
  setItem: vi.fn((key: string, value: string) => { storage.set(key, value) }),
  removeItem: vi.fn((key: string) => { storage.delete(key) }),
  clear: vi.fn(() => { storage.clear() }),
  get length() { return storage.size },
  key: vi.fn((index: number) => [...storage.keys()][index] ?? null),
}
vi.stubGlobal('localStorage', localStorageMock)

const { useSideTabs } = await import('../useSideTabs')

describe('useSideTabs', () => {
  beforeEach(() => {
    storage.clear()
    localStorageMock.getItem.mockClear()
    localStorageMock.setItem.mockClear()
  })

  it('defaults to tab1', () => {
    const { sideTab } = useSideTabs()
    expect(sideTab.value).toBe('tab1')
  })

  it('selectTab changes the active tab', () => {
    const { sideTab, selectTab } = useSideTabs()

    selectTab('tab2')
    expect(sideTab.value).toBe('tab2')

    selectTab('tab3')
    expect(sideTab.value).toBe('tab3')
  })

  it('returns the same singleton across calls', () => {
    const a = useSideTabs()
    const b = useSideTabs()

    expect(a.sideTab).toBe(b.sideTab)
  })
})
