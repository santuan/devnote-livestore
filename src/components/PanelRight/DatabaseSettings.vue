<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'
import { shallowRef } from 'vue'
import { useI18n } from 'vue-i18n'
import ButtonDeleteAllDocument from '@/components/Shared/ButtonDeleteAllDocument.vue'

const showDBSettings = shallowRef(false)
const { t } = useI18n()
</script>

<template>
  <div class="text-xs bg-background">
    <button
      class="flex pl-1 pr-2 w-full h-10  text-left items-center justify-between gap-2"
      @click="showDBSettings = !showDBSettings"
    >
      <div class="flex items-center justify-start gap-2">
        <ChevronRight class="text-foreground size-3 duration-300 transition-transform" :class="showDBSettings ? 'rotate-90' : ''" />
        <span class="font-semibold text-primary">
          {{ t("settings.database") }}
        </span>
      </div>
    </button>
    <div
      v-show="showDBSettings"
      class="flex  divide-y divide-muted text-xs justify-start items-start p-3 gap-2 flex-col"
    >
      <div class="flex gap-2 items-center justify-between w-full">
        <span>{{ t("editor.deleteAll") }}</span>
        <ButtonDeleteAllDocument />
      </div>
    </div>
  </div>
</template>
