import { useStorage } from '@vueuse/core'

// --- Shared singleton state ---
const sideTab = useStorage('values', 'tab1')

export function useSideTabs() {
  function selectTab(tab: string) {
    sideTab.value = tab
  }

  return {
    sideTab,
    selectTab,
  }
}
