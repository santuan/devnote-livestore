<script setup lang="ts">
import { ChevronsUpDown } from 'lucide-vue-next'
import { shallowRef } from 'vue'
import { useI18n } from 'vue-i18n'
import ButtonDeleteAllDocument from '../Shared/ButtonDeleteAllDocument.vue'

const showDBSettings = shallowRef(false)
const { t } = useI18n()
</script>

<template>
  <div class="text-sm">
    <button
      class="flex pl-1 pr-2 w-full h-10 bg-secondary/20 text-left items-center justify-between gap-2"
      @click="showDBSettings = !showDBSettings"
    >
      <span class="text-sm font-semibold text-primary">
        {{ t("settings.database") }}
      </span>
      <span class="flex items-center justify-center size-5">
        <ChevronsUpDown class="text-foreground size-3" />
      </span>
    </button>
  </div>
  <div
    v-show="showDBSettings"
    class="flex bg-primary/5 divide-y divide-muted text-xs justify-start items-start p-1 gap-2 flex-col"
  >
    <div class="flex gap-2 items-center justify-between w-full">
      <span>{{ t("editor.deleteAll") }}</span>
      <ButtonDeleteAllDocument />
    </div>
  </div>
</template>
