<script setup lang="ts">
import { ArrowDownAZ, ArrowDownZA, Circle, CircleOff } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { useClientDocument } from 'vue-livestore'
import { tables } from '@/livestore/schema'

const { t } = useI18n()
const { filter, sortBy } = useClientDocument(tables.uiState)
</script>

<template>
  <div class="flex mt-3 justify-between w-full items-center">
    <div class="flex items-center justify-start gap-2">
      <button
        class="px-2 font-bold h-8 flex justify-center items-center gap-1 text-xs text-primary"
        @click="sortBy === 'asc' ? (sortBy = 'desc') : (sortBy = 'asc')"
      >
        <ArrowDownZA v-if="sortBy === 'desc'" class="size-5" />
        <ArrowDownAZ v-if="sortBy === 'asc'" class="size-5" />
      </button>
      <slot />
    </div>
    <div class="flex justify-end items-center">
      <button
        class="px-3 bg-secondary font-bold h-8 flex justify-center text-sm items-center gap-1"
        :class="filter === 'all' ? ' text-primary' : ''"
        @click="filter = 'all'"
      >
        {{ t("sidebar.filterAll") }}
      </button>
      <button
        class="px-3 bg-secondary font-bold h-8 flex justify-center items-center gap-1"
        :class="filter === 'active' ? ' text-primary' : ''"
        @click="filter = 'active'"
      >
        <Circle class="size-4" />
      </button>
      <button
        class="px-3 bg-secondary font-bold h-8 flex justify-center items-center gap-1"
        :class="filter === 'completed' ? ' text-primary' : ''"
        @click="filter = 'completed'"
      >
        <CircleOff class="size-4" />
      </button>
    </div>
  </div>
</template>
