import { queryDb } from '@livestore/livestore'
import { useDebounceFn } from '@vueuse/core'
import { computed, shallowRef, watchEffect } from 'vue'
import { useClientDocument, useQuery, useStore } from 'vue-livestore'
import { events, tables } from '@/livestore/schema'

// --- Shared singleton state (across all call sites) ---
const editable_id = shallowRef('')
const newDocumentTitle = shallowRef('')
const newDocumentContent = shallowRef('')
const unsavedChanges = shallowRef(false)

const uiState$ = queryDb(tables.uiState.get(), { label: 'uiState' })

const visibleDocuments$ = queryDb(
  (get) => {
    const filter = get(uiState$).filter
    const sort = get(uiState$).sort
    const sortBy = get(uiState$).sortBy
    return tables.documents
      .where({
        deletedAt: null,
        completed: filter === 'all' ? undefined : filter === 'completed',
      })
      .orderBy(sort, sortBy)
  },
  { label: 'visibleDocuments' },
)

export function useDocumentLifecycle() {
  const { store } = useStore()
  const { showDocuments, editable } = useClientDocument(tables.uiState)
  const documents = useQuery(visibleDocuments$)
  const documents_count = computed(() => documents.value.length)

  function createDocument() {
    const id = crypto.randomUUID()
    store.commit(
      events.documentCreated({
        id,
        text: newDocumentTitle.value,
        content: newDocumentContent.value,
      }),
    )
    editable_id.value = id
  }

  function resetStore() {
    newDocumentTitle.value = ''
    newDocumentContent.value = ''
    editable_id.value = ''
    editable.value = true
    createDocument()
  }

  function editDocument(id: string) {
    if (unsavedChanges.value) {
      // eslint-disable-next-line no-alert
      const confirmUnsaved = confirm(
        'Tiene cambios sin guardar. ¿Desea perder los cambios?',
      )
      if (!confirmUnsaved) {
        return
      }
    }
    if (!id)
      return
    const foundTodo = documents.value.find(todo => todo.id === id)
    if (!foundTodo)
      return
    newDocumentTitle.value = foundTodo.text
    newDocumentContent.value = foundTodo.content
    editable_id.value = id
  }

  function updateDocument() {
    store.commit(
      events.documentUpdated({
        id: editable_id.value,
        text: newDocumentTitle.value,
        content: newDocumentContent.value,
      }),
    )
  }

  function updateDocumentTitle() {
    store.commit(
      events.documentUpdatedTitle({
        id: editable_id.value,
        text: newDocumentTitle.value,
      }),
    )
  }

  function toggleCompleted(id: string) {
    if (documents.value.find(item => item.id === id)?.completed) {
      store.commit(events.documentUncompleted({ id }))
    }
    else {
      store.commit(events.documentCompleted({ id }))
    }
  }

  function auto_save() {
    if (!editable_id.value)
      return
    if (newDocumentContent.value === '')
      return
    updateDocument()
  }

  const debouncedAutoSave = useDebounceFn(auto_save, 150)

  watchEffect(() => {
    if (newDocumentContent.value)
      debouncedAutoSave()
    if (newDocumentContent.value !== '' && editable_id.value.length === 0) {
      unsavedChanges.value = true
    }
    else {
      unsavedChanges.value = false
    }
  })

  watchEffect(() => {
    if (newDocumentTitle.value)
      updateDocumentTitle()
  })

  function selectDocument(id: string) {
    editDocument(id)
  }

  return {
    editable_id,
    newDocumentTitle,
    newDocumentContent,
    unsavedChanges,
    showDocuments,
    editable,
    documents,
    documents_count,
    createDocument,
    resetStore,
    editDocument,
    updateDocument,
    updateDocumentTitle,
    toggleCompleted,
    selectDocument,
  }
}
