<script setup lang="ts">
import { useLayoutPresets } from '@/composables/useLayoutPresets'

const { applyPreset } = useLayoutPresets()

interface Preset {
  id: string
  left: string
  center: string
  centerLabel: string
  right: string
}

const PRESETS: Preset[] = [
  { id: 'layout1', left: '30%', center: '40%', centerLabel: '40%', right: '30%' },
  { id: 'layout2', left: '30%', center: '40%', centerLabel: '50%', right: '30%' },
  { id: 'layout4', left: '15%', center: '70%', centerLabel: '70%', right: '15%' },
  { id: 'layout5', left: '5%', center: '90%', centerLabel: '90%', right: '5%' },
  { id: 'layout3', left: '5%', center: '65%', centerLabel: '65%', right: '30%' },
  { id: 'layout6', left: '30%', center: '65%', centerLabel: '65%', right: '5%' },
]
</script>

<template>
  <div class="grid gap-2 grid-cols-1 pl-2 @md:grid-cols-3">
    <button
      v-for="p in PRESETS"
      :key="p.id"
      class="flex gap-px h-8 text-xs items-center justify-center text-center w-full bg-secondary/80"
      @click="applyPreset(p.id)"
    >
      <span
        class="bg-secondary/30 flex justify-center items-center h-8"
        :style="{ width: p.left }"
      />
      <span
        class="bg-primary/10  text-primary flex justify-center items-center h-8"
        :style="{ width: p.center }"
      >
        {{ p.centerLabel }}
      </span>
      <span
        class="bg-secondary/30 flex justify-center items-center h-8"
        :style="{ width: p.right }"
      />
    </button>
  </div>
</template>
