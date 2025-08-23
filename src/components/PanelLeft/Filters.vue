<script setup lang="ts">
import { ArrowDownAZ, ArrowDownZA, Circle, CircleOff } from 'lucide-vue-next'
import { useClientDocument } from 'vue-livestore'
import { tables } from '@/livestore/schema'

const { filter, sortBy }
  = useClientDocument(tables.uiState)
</script>

<template>
  <div class="flex justify-end items-center">
    <button
      class="px-2 font-bold h-8 border flex justify-center items-center gap-1 text-xs border-primary"
      :class="
        filter === 'all' ? 'bg-primary text-primary-foreground' : ''
      "
      @click="filter = 'all'"
    >
      All
    </button>
    <button
      class="px-2 font-bold h-8 border flex justify-center items-center gap-1 text-xs border-primary"
      :class="
        filter === 'active'
          ? 'bg-primary text-primary-foreground'
          : ''
      "
      @click="filter = 'active'"
    >
      <Circle class="size-4" />
    </button>
    <button
      class="px-2 font-bold h-8 border flex justify-center items-center gap-1 text-xs border-primary"
      :class="
        filter === 'completed'
          ? 'bg-primary text-primary-foreground'
          : ''
      "
      @click="filter = 'completed'"
    >
      <CircleOff class="size-4" />
    </button>
    <button class="px-2 font-bold h-8 border flex justify-center items-center gap-1 text-xs border-primary" @click="sortBy === 'asc' ? sortBy = 'desc' : sortBy = 'asc'">
      <ArrowDownZA v-if="sortBy === 'desc'" class="size-4" />
      <ArrowDownAZ v-if="sortBy === 'asc'" class="size-4" />
    </button>
  </div>
</template>
