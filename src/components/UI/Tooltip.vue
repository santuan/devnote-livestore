<script setup lang='ts'>
import {
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from 'reka-ui'

export interface TooltipProps {
  label?: string
  name?: string
  shortcut?: string
  side?: 'right' | 'top' | 'bottom' | 'left' | undefined
  align?: 'start' | 'center' | 'end' | undefined
  alignOffset?: number
}

withDefaults(defineProps<TooltipProps>(), {
  name: '',
  shortcut: '',
  side: 'right',
  alignOffset: 0,
  align: 'center',
})
</script>

<template>
  <TooltipProvider>
    <TooltipRoot ignore-non-keyboard-focus>
      <TooltipTrigger as-child>
        <slot />
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent
          class="print:hidden! ring-primary ring-1 select-none max-w-80 min-h-7 bg-secondary px-2.5 py-1.5 flex gap-2 items-center justify-center"
          :class="shortcut ? 'flex-col' : ' '" :side-offset="7" :side="side" :align="align"
        >
          <span v-show="name" class="font-mono text-xs font-medium text-secondary-foreground">{{ name }}</span>
          <kbd
            v-show="shortcut"
            class="pointer-events-none uppercase inline-flex h-5 select-none items-center gap-1 rounded px-1.5 font-mono text-[10px] text-secondary-foreground font-extrabold"
          >
            {{ shortcut }}
          </kbd>
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
</template>
