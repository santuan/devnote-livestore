<script lang="ts" setup>
import NumberFlow from '@number-flow/vue'
import { X } from 'lucide-vue-next'
import { computed } from 'vue'
import Filters from './Filters.vue'

const props = defineProps<{
  count: number
}>()

const emit = defineEmits<{
  (e: 'open'): void
}>()

const documents = computed(() => props.count ?? 0)
</script>

<template>
  <div class="w-full @container">
    <div class="flex mb-px gap-2 justify-end items-center">
      <div class="flex items-center gap-1">
        <button class="size-8 flex justify-center items-center" @click="emit('open')">
          <X class="size-4" />
        </button>
      </div>
    </div>
    <slot name="top" />
    <div class="flex justify-between mt-px pl-1 py-px items-center">
      <div class="flex justify-between items-center">
        <h1 class="text-xs hidden mr-2 capitalize @xs:flex text-primary">
          documents
        </h1>
        <NumberFlow class="text-xs mr-1" :value="documents" />
      </div>
      <Filters />
    </div>
    <div
      class="max-h-[calc(100vh-2.75rem)] h-screen border-t border-secondary overflow-x-hidden overflow-y-auto"
    >
      <slot name="list" />
    </div>
  </div>
</template>
