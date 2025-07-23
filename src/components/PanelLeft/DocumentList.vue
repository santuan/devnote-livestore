<script lang="ts" setup>
import NumberFlow from '@number-flow/vue'
import { computed } from 'vue'
import Filters from './Filters.vue'

const props = defineProps<{
  count: number
}>()

const documents = computed(() => props.count ?? 0)
</script>

<template>
  <div class="w-full @container">
    <div class="flex mb-3 gap-2 justify-end items-center">
      <div class="flex items-center gap-1">
        <NumberFlow class="text-xs mr-1" :value="documents" />
        <h1 class="text-xs hidden mr-2 @xs:flex text-primary">
          documents
        </h1>
        <Filters />
      </div>
    </div>
    <div
      class="max-h-[calc(100vh-2.75rem)] h-screen border-t border-secondary overflow-x-hidden overflow-y-auto"
    >
      <slot />
    </div>
  </div>
</template>
