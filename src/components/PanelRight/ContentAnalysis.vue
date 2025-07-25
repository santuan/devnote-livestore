<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import type { Ref } from 'vue'
import NumberFlow from '@number-flow/vue'
import { ChevronRight } from 'lucide-vue-next'
import { computed, inject, shallowRef } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const editor = inject('content') as Ref<Editor>

const showContentAnalysis = shallowRef(true)

const contentAnalysis = computed(() => {
  if (!editor.value) {
    return {
      codeBlocks: 0,
      headings: [],
      totalHeadings: 0,
      wordCount: 0,
      characterCount: 0,
      taskListCount: 0,
      taskListCheckedCount: 0,
    }
  }

  const doc = editor.value.state.doc
  const headings: Array<{ level: number, text: string, pos: number }> = []
  let codeBlocks = 0
  let taskListCount = 0
  let taskListCheckedCount = 0

  // Traverse the document to find headings and code blocks
  doc.descendants((node: any, pos: any) => {
    if (node.type.name === 'heading') {
      const level = node.attrs.level
      const text = node.textContent.trim()
      headings.push({ level, text: text || `Heading ${level}`, pos })
    }
    else if (node.type.name === 'codeBlock') {
      codeBlocks++
    }
    else if (node.type.name === 'taskItem') {
      if (node.attrs.checked === true) {
        taskListCheckedCount++
      }
      taskListCount++
    }
  })

  return {
    codeBlocks,
    headings,
    taskListCount,
    taskListCheckedCount,
    totalHeadings: headings.length,
    wordCount: editor.value.storage.characterCount?.words?.() || 0,
    characterCount: editor.value.storage.characterCount?.characters?.() || 0,
  }
})
</script>

<template>
  <div>
    <div class="w-full bg-background relative">
      <button
        class="flex pl-1 pr-2 w-full h-10 text-left items-center justify-between gap-2"
        @click="showContentAnalysis = !showContentAnalysis"
      >
        <div class="flex items-center justify-start gap-2">
          <ChevronRight
            class="text-foreground size-3 duration-300 transition-transform"
            :class="showContentAnalysis ? 'rotate-90' : ''"
          />
          <span class="text-xs font-semibold text-primary">
            {{ t("leva.contentStatistics") }}
          </span>
        </div>
      </button>
      <div
        v-if="showContentAnalysis"
        class="flex px-1 flex-col @xs:grid @xs:grid-cols-2 pl-2 @md:grid-cols-4 mt-1 gap-2 text-xs pb-3 pt-2"
      >
        <div class="flex flex-col">
          <span class="opacity-50">{{ t("leva.codeBlocks") }}:</span>
          <span class="font-mono font-bold">
            {{ contentAnalysis.codeBlocks }}
          </span>
        </div>
        <div class="flex flex-col">
          <span class="opacity-50">{{ t("leva.headings") }}:</span>
          <span class="font-mono font-bold">
            {{ contentAnalysis.totalHeadings }}
          </span>
        </div>
        <div class="flex flex-col">
          <span class="opacity-50">{{ t("leva.words") }}:</span>
          <span class="font-mono font-bold">
            {{ contentAnalysis.wordCount }}
          </span>
        </div>
        <div class="flex flex-col">
          <span class="opacity-50">{{ t("leva.task") }}:</span>
          <span
            v-if="contentAnalysis.taskListCount !== 0"
            class="font-mono font-bold"
            :class="
              contentAnalysis.taskListCount
                === contentAnalysis.taskListCheckedCount
                ? 'text-primary'
                : ''
            "
          >
            <NumberFlow :value="contentAnalysis.taskListCheckedCount" />
            /
            <NumberFlow :value="contentAnalysis.taskListCount" />
          </span>
          <span v-else>---</span>
        </div>
        <div v-if="editor" class="mt-0.5 col-span-2 @md:col-span-4">
          <div
            class="flex flex-col @xs:flex-row items-center justify-between mb-1"
          >
            <span class="text-xs opacity-50">{{ t("leva.character") }}</span>
            <span class="font-mono text-xs">
              {{ contentAnalysis.characterCount }}
              / 50000</span>
          </div>
          <div class="w-full h-1 rounded-full bg-secondary">
            <div
              class="h-1.5 rounded-full bg-primary transition-all"
              :style="{
                width: `${Math.min(
                  (contentAnalysis.characterCount / 50000) * 100,
                  100,
                )}%`,
              }"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
