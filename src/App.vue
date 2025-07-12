<script setup lang="ts">
import { makePersistedAdapter } from '@livestore/adapter-web'
import LiveStoreSharedWorker from '@livestore/adapter-web/shared-worker?sharedworker'

import { LiveStoreProvider } from 'vue-livestore'
import AppDesktop from './components/AppDesktop.vue'
import Loading from './components/Loading.vue'
import LiveStoreWorker from './livestore/livestore.worker?worker'
import { schema } from './livestore/schema'

const adapter = makePersistedAdapter({
  storage: { type: 'opfs' },
  worker: LiveStoreWorker,
  sharedWorker: LiveStoreSharedWorker,
})

const storeOptions = {
  schema,
  adapter,
  storeId: 'test_store',
}
</script>

<template>
  <LiveStoreProvider :options="storeOptions">
    <template #loading>
      <Loading />
    </template>
    <AppDesktop />
  </LiveStoreProvider>
</template>
