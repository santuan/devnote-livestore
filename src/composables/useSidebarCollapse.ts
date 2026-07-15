import { shallowRef, watch } from 'vue'

// --- Shared singleton state ---
const showDocuments = shallowRef(true)
const sidebar_documents_splitter_ref = shallowRef<any>(null)
const sidebar_secondary_splitter_ref = shallowRef<any>(null)

export function useSidebarCollapse() {
  function toggle_documents() {
    showDocuments.value = !showDocuments.value
  }

  function hide_panel_left() {
    showDocuments.value = false
  }

  function collapseSecondarySidebar() {
    if (!sidebar_secondary_splitter_ref.value)
      return
    sidebar_secondary_splitter_ref.value.collapse()
  }

  function expandSecondarySidebar() {
    sidebar_secondary_splitter_ref.value?.resize(20)
  }

  watch(
    () => showDocuments.value,
    (showSidebar) => {
      if (!showSidebar) {
        sidebar_documents_splitter_ref.value?.collapse()
      }
      else {
        if (sidebar_documents_splitter_ref.value?.isCollapsed) {
          sidebar_documents_splitter_ref.value.resize(25)
        }
      }
    },
    { flush: 'post' },
  )

  return {
    showDocuments,
    sidebar_documents_splitter_ref,
    sidebar_secondary_splitter_ref,
    toggle_documents,
    hide_panel_left,
    collapseSecondarySidebar,
    expandSecondarySidebar,
  }
}
