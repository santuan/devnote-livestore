<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    item: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },

  emits: ['itemClick'],
  methods: {
    onItemClick(event: MouseEvent) {
      this.$emit('itemClick', event, this.item.id)
    },
    getHeadingClass(level: number) {
      const classes = {
        1: 'pl-1 pr-3 font-mono text-xs font-bold text-foreground',
        2: 'pl-1 pr-3 font-mono text-xs text-foreground',
        3: 'pl-2 pr-3 font-mono text-xs text-foreground',
        4: 'pl-3 pr-3 font-mono text-xs text-foreground',
        5: 'pl-4 pr-3 font-mono text-xs text-muted-foreground',
        6: 'pl-5 pr-3 font-mono text-xs text-muted-foreground',
      }
      return (
        classes[level as keyof typeof classes]
        || 'font-mono text-xs text-muted-foreground'
      )
    },
  },
})
</script>

<template>
  <div
    :class="{
      'is-active': item.isActive && !item.isScrolledOver,
    }"
    :style="{ '--level': item.originalLevel }"
    class="flex items-center justify-start"
  >
    <span
      class="h-6 border-l border-transparent duration-300"
      :class="{
        '!border-primary': item.isScrolledOver,
      }"
    />
    <a
      class="flex items-center justify-between w-full gap-2 p-1 truncate transition-colors duration-150 rounded hover:bg-secondary/50 focus:outline-none cursor-default focus:ring-1 focus:ring-primary"
      :class="[getHeadingClass(item.originalLevel)]"
      :href="`#${item.id}`"
      :data-item-index="item.itemIndex"
      @click.prevent="onItemClick"
    >
      <span
        class="line-clamp-1 opacity-60 hover:opacity-100 w-full text-left text-xs"
        :class="{
          'opacity-100': item.isScrolledOver,
        }"
      >
        {{ item.textContent }}
      </span>
      <span class="opacity-30">H{{ item.originalLevel }}</span>
    </a>
  </div>
</template>
