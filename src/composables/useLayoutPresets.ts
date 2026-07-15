import { shallowRef } from 'vue'
import { useSidebarCollapse } from './useSidebarCollapse'

const layout = shallowRef<number[]>([0, 0])

interface LayoutPreset {
  left: number
  right: number
}

const PRESETS: Record<string, LayoutPreset> = {
  layout1: { left: 30, right: 30 }, // 40/20/40 (approx)
  layout2: { left: 25, right: 25 }, // 25/50/25
  layout3: { left: 5, right: 50 }, // 5/45/50
  layout4: { left: 50, right: 5 }, // 50/45/5
  layout5: { left: 15, right: 15 }, // 15/70/15
  layout6: { left: 5, right: 5 }, // 5/90/5
}

export function useLayoutPresets() {
  const {
    sidebar_documents_splitter_ref,
    sidebar_secondary_splitter_ref,
    collapseSecondarySidebar,
    expandSecondarySidebar,
  } = useSidebarCollapse()

  function applyPreset(id: string) {
    const preset = PRESETS[id]
    if (!preset || !layout.value)
      return
    sidebar_documents_splitter_ref.value?.resize(preset.left)
    sidebar_secondary_splitter_ref.value?.resize(preset.right)
  }

  function onLayoutChange(newLayout: number[]) {
    const current = layout.value
    // Guard: skip if nothing changed — prevents recursive @layout cycles
    if (current && current.length === newLayout.length && current.every((v, i) => v === newLayout[i])) {
      return
    }
    layout.value = newLayout
  }

  return {
    layout,
    applyPreset,
    onLayoutChange,
    collapseSecondarySidebar,
    expandSecondarySidebar,
  }
}
