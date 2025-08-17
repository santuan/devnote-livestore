import { Events, makeSchema, Schema, SessionIdSymbol, State } from '@livestore/livestore'

// State is modelled as SQLite tables
export const tables = {
  documents: State.SQLite.table({
    name: 'documents',
    columns: {
      id: State.SQLite.text({ primaryKey: true }),
      text: State.SQLite.text({ default: '' }),
      content: State.SQLite.text({ default: '' }),
      completed: State.SQLite.boolean({ default: false }),
      deletedAt: State.SQLite.integer({ nullable: true, schema: Schema.DateFromNumber }),
      modified: State.SQLite.integer({ nullable: true, schema: Schema.DateFromNumber }),
    },
  }),
  // Client documents can be used for client-only state (for example form inputs)
  uiState: State.SQLite.clientDocument({
    name: 'uiState',
    schema: Schema.Struct({
      filter: Schema.Literal('all', 'active', 'completed'),
      showDocuments: Schema.Boolean,
      editable: Schema.Boolean,
    }),
    default: {
      id: SessionIdSymbol,
      value: {
        filter: 'active',
        showDocuments: true,
        editable: true,
      },
    },
  }),
}

export const events = {
  documentCreated: Events.synced({
    name: 'v1.DocumentCreated',
    schema: Schema.Struct({ id: Schema.String, text: Schema.String, content: Schema.String }),
  }),
  documentUpdated: Events.synced({
    name: 'v1.DocumentUpdated',
    schema: Schema.Struct({ id: Schema.String, text: Schema.String, content: Schema.String }),
  }),
  documentCompleted: Events.synced({
    name: 'v1.DocumentCompleted',
    schema: Schema.Struct({ id: Schema.String }),
  }),
  documentUncompleted: Events.synced({
    name: 'v1.DocumentUncompleted',
    schema: Schema.Struct({ id: Schema.String }),
  }),
  documentDeleted: Events.synced({
    name: 'v1.DocumentDeleted',
    schema: Schema.Struct({ id: Schema.String, deletedAt: Schema.Date }),
  }),
  documentClearedCompleted: Events.synced({
    name: 'v1.DocumentClearedCompleted',
    schema: Schema.Struct({ deletedAt: Schema.Date }),
  }),
  documentDeletedAll: Events.synced({
    name: 'v1.DocumentDeletedAll',
    schema: Schema.Struct({ deletedAt: Schema.Date }),
  }),
  uiStateSet: tables.uiState.set,
}

// Materializers are used to map events to state
const materializers = State.SQLite.materializers(events, {
  'v1.DocumentCreated': ({ id, text, content }) => tables.documents.insert({ id, text, content, completed: false }),
  'v1.DocumentUpdated': ({ id, text, content }) => tables.documents.update({ text, content }).where({ id }),
  'v1.DocumentCompleted': ({ id }) => tables.documents.update({ completed: true }).where({ id }),
  'v1.DocumentUncompleted': ({ id }) => tables.documents.update({ completed: false }).where({ id }),
  'v1.DocumentDeleted': ({ id, deletedAt }) => tables.documents.update({ deletedAt }).where({ id }),
  'v1.DocumentClearedCompleted': ({ deletedAt }) => tables.documents.update({ deletedAt }).where({ completed: true }),
  'v1.DocumentDeletedAll': ({ deletedAt }) => tables.documents.update({ deletedAt }).where({}),
})

const state = State.SQLite.makeState({ tables, materializers })
export const schema = makeSchema({ events, state })
