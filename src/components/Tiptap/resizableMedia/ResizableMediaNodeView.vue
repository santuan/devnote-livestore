<script setup lang="ts">
import type { Editor, Node } from '@tiptap/vue-3'
import type { Node as ProseMirrorNode } from 'prosemirror-model'
import type { Decoration } from 'prosemirror-view'
import NumberFlow, { continuous } from '@number-flow/vue'

import { NodeViewWrapper } from '@tiptap/vue-3'
import {
  AlignCenterVertical,
  AlignEndVertical,
  AlignStartVertical,
  Expand,
  Video as IconVideo,
  Play,
  RulerDimensionLine,
  Trash,
  X,
} from 'lucide-vue-next'
import { DialogClose, DialogContent, DialogDescription, DialogOverlay, DialogPortal, DialogRoot, DialogTitle, DialogTrigger, NumberFieldInput, NumberFieldRoot, PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger, SliderRange, SliderRoot, SliderThumb, SliderTrack, ToggleGroupItem, ToggleGroupRoot, TooltipContent, TooltipPortal, TooltipProvider, TooltipRoot, TooltipTrigger } from 'reka-ui'
import { computed, onMounted, ref, watch } from 'vue'
/* Disclaimer. All this folder is based upon work of sereneinserenade tiptap-media-resize
Tiptap Extension for having resizable, alignable, floatable, movable media.
https://github.com/sereneinserenade/tiptap-media-resize

** I have made some changes to the original code. */
import { useI18n } from 'vue-i18n'

import { useClientDocument } from 'vue-livestore'
import { tables } from '@/livestore/schema'
import { resizableMediaActions } from './resizableMediaMenuUtil'

const props = defineProps<Props>()

interface Props {
  editor: Editor
  node: ProseMirrorNode
  decorations: Decoration
  selected: boolean
  extension: Node<any, any>
  getPos: () => number
  updateAttributes: (attributes: Record<string, any>) => void
  deleteNode: () => void
}

const mediaType = computed<'img' | 'video'>(() => props.node.attrs['media-type'])
const resizableImg = ref<HTMLImageElement | HTMLVideoElement | null>(null)
const aspectRatio = ref(0)
const proseMirrorContainerWidth = ref<string | boolean>('100%')
const mediaActionActiveState = ref<Record<string, boolean>>({})
const sliderValue = ref([50])
const isPopoverOpen = ref(false)
const { t } = useI18n()
function setMediaActionActiveStates() {
  const activeStates: Record<string, boolean> = {}
  for (const { tooltip, isActive } of resizableMediaActions)
    activeStates[tooltip] = !!isActive?.(props.node.attrs)
  mediaActionActiveState.value = activeStates
}

watch(
  () => props.node.attrs,
  () => setMediaActionActiveStates(),
  { deep: true },
)

// Add this watch after the existing watches
watch(
  () => sliderValue.value[0],
  (newValue) => {
    setWidth(newValue)
  },
)

const isGif = computed(() => {
  const src: string | undefined = props.node.attrs.src
  if (!src)
    return false
  const lowerSrc = src.toLowerCase()

  // Check data URI for GIF MIME type
  if (lowerSrc.startsWith('data:image/gif'))
    return true

  try {
    const url = new URL(src, window.location.origin)
    const pathname = url.pathname.toLowerCase()
    return pathname.endsWith('.gif')
  }
  catch {
    // If it's not a valid URL, just check string
    return lowerSrc.endsWith('.gif')
  }
})

function mediaSetupOnLoad() {
  const proseMirrorContainerDiv = document.querySelector('.Document')
  if (proseMirrorContainerDiv)
    proseMirrorContainerWidth.value = '100%'
  if (!resizableImg.value)
    return
  if (mediaType.value === 'video') {
    // Aspect Ratio from its original size
    setTimeout(() => {
      aspectRatio.value
        = (resizableImg.value as HTMLVideoElement).videoWidth
          / (resizableImg.value as HTMLVideoElement).videoHeight
    }, 200)
  }
  else {
    resizableImg.value.onload = () => {
      // Aspect Ratio from its original size
      aspectRatio.value
        = (resizableImg.value as HTMLImageElement).naturalWidth
          / (resizableImg.value as HTMLImageElement).naturalHeight
    }
    updateSliderValueFromCurrentWidth()
  }
  setTimeout(() => setMediaActionActiveStates(), 200)
}

onMounted(() => mediaSetupOnLoad())

const isAlign = computed<boolean>(() => !!props.node.attrs.dataAlign)

function setWidth(percentage: any) {
  if (!resizableImg.value) {
    console.error('Media ref is undefined|null', { resizableImg: resizableImg.value })
    return
  }
  const newMediaDimensions = {
    width: `${percentage}%`,
    height: 'auto',
  }
  sliderValue.value[0] = percentage
  props.updateAttributes(newMediaDimensions)
}

function updateSliderValueFromCurrentWidth() {
  if (!resizableImg.value)
    return

  try {
    // Default percentage value
    let percentageValue = 50

    // Try to get width from node attributes first
    let currentWidth = props.node.attrs.width

    // If not found in attrs, try getting from the DOM element
    if (!currentWidth && resizableImg.value) {
      currentWidth = resizableImg.value.style.width
        || window.getComputedStyle(resizableImg.value).width
    }

    // If we have a width value, convert it to a percentage
    if (currentWidth) {
      // Convert to string to safely use string methods
      const widthStr = String(currentWidth)

      if (widthStr.includes('%')) {
        // If already a percentage, parse it
        percentageValue = Number.parseInt(widthStr, 10)
      }
      else if (widthStr.includes('px')) {
        // If in pixels, calculate percentage
        const containerWidth = resizableImg.value.parentElement?.offsetWidth
          || document.querySelector('.Document')?.clientWidth
          || 1000 // fallback
        const pixelValue = Number.parseInt(widthStr, 10)
        percentageValue = Math.round((pixelValue / containerWidth) * 100)
      }
      else {
        // Try to parse as number directly, could be a number without units
        const numValue = Number.parseFloat(widthStr)
        if (!Number.isNaN(numValue)) {
          if (numValue <= 1) {
            // Likely a ratio (0-1)
            percentageValue = Math.round(numValue * 100)
          }
          else if (numValue <= 100) {
            // Possibly already a percentage without % sign
            percentageValue = Math.round(numValue)
          }
          else {
            // Likely pixels without px unit
            const containerWidth = resizableImg.value.parentElement?.offsetWidth
              || document.querySelector('.Document')?.clientWidth
              || 1000 // fallback
            percentageValue = Math.round((numValue / containerWidth) * 100)
          }
        }
      }
    }
    percentageValue = Math.max(10, Math.min(100, percentageValue))
    sliderValue.value = [percentageValue]
  }
  catch (error) {
    console.error('Error calculating width percentage:', error)
    sliderValue.value = [50]
  }
}

function handlePopoverOpen() {
  updateSliderValueFromCurrentWidth()
  isPopoverOpen.value = true
}

function handlePopoverClose() {
  isPopoverOpen.value = false
}

const canvasRef = ref<HTMLCanvasElement | null>(null)
const isPaused = ref(false)

function togglePause() {
  isPaused.value = !isPaused.value

  if (isPaused.value && resizableImg.value && canvasRef.value) {
    const canvas = canvasRef.value
    const context = canvas.getContext('2d')
    if (context) {
      canvas.width = (resizableImg.value as HTMLImageElement).naturalWidth
      canvas.height = (resizableImg.value as HTMLImageElement).naturalHeight
      context.drawImage(resizableImg.value, 0, 0)
    }
  }
}

const { editable } = useClientDocument(tables.uiState)
</script>

<template>
  <NodeViewWrapper
    as="article"
    class="relative flex my-0 overflow-hidden media-node-view not-prose"
  >
    <div v-if="editable" class="bg-secondary/30 flex justify-between items-center absolute top-0 left-0 right-0 h-9">
      <div class="flex">
        <PopoverRoot>
          <PopoverTrigger
            aria-label="Update dimensions"
            class=" z-50 flex items-center justify-center size-9 bg-secondary text-foreground PopoverTrigger print:hidden focus-within:bg-secondary focus-within:text-secondary-foreground focus-within:outlined focus-within:outline-dashed focus-within:-outline-offset-4 focus-within:outline-primary"
          >
            <AlignStartVertical v-if="props.node.attrs.dataAlign === 'start'" class="size-4" />
            <AlignCenterVertical v-else-if="props.node.attrs.dataAlign === 'center'" class="size-4" />
            <AlignEndVertical v-else class="size-4" />
          </PopoverTrigger>
          <PopoverPortal>
            <PopoverContent
              side="bottom"
              align="center"
              class="p-0.5 w-9 flex-col justify-center items-center gap-0.5 flex font-mono text-xs bg-background text-foreground focus-visible:ring-4 hover:ring-2  ring-1 ring-primary"
            >
              <ToggleGroupRoot
                type="single"
              >
                <ToggleGroupItem
                  v-for="(mediaAction, i) in resizableMediaActions"
                  :key="i"
                  :value="mediaAction.tooltip"
                  aria-label="Toggle italic"
                  :content="mediaAction.tooltip"
                  class="flex items-center justify-center gap-1 size-8 hover:text-primary"
                  @click="mediaAction.action?.(updateAttributes)"
                >
                  <component :is="mediaAction.icon" class="shrink-0 size-4" />
                  <span class="sr-only">{{ mediaAction.tooltip }}</span>
                </ToggleGroupItem>
              </ToggleGroupRoot>
            </PopoverContent>
          </PopoverPortal>
        </PopoverRoot>
        <PopoverRoot @update:open="(isOpen) => isOpen ? handlePopoverOpen() : handlePopoverClose()">
          <div class=" flex  z-20">
            <PopoverTrigger
              aria-label="Update width"
              class="flex items-center justify-center PopoverTrigger print:hidden size-9 focus-within:bg-secondary focus-within:text-secondary-foreground focus-within:outlined focus-within:outline-dashed focus-within:-outline-offset-4 focus-within:outline-primary bg-secondary text-foreground"
            >
              <span class="">
                <RulerDimensionLine class="size-4" />
              </span>
            </PopoverTrigger>
            <NumberFieldRoot
              v-model="sliderValue[0]"
              :min="10"
              :max="100"
              class="flex items-center h-9 pl-2 justify-start text-xs font-semibold NumberFieldRoot bg-secondary/95 backdrop-blur-md text-foreground"
            >
              <NumberFieldInput class="font-mono outline-hidden w-10 h-6 text-center bg-background/70 text-foreground" />
              <span class="w-6 font-mono text-center">%</span>
            </NumberFieldRoot>
          </div>
          <PopoverPortal>
            <PopoverContent
              side="right"
              align="start"
              class="flex items-center justify-center gap-3 px-3 font-mono h-9 overflow-hidden rtext-xs text-foreground bg-secondary"
            >
              <TooltipProvider :delay-duration="0">
                <SliderRoot
                  v-model="sliderValue"
                  class="relative flex items-center select-none touch-none w-[150px] h-5 SliderRoot"
                  :max="100"
                  :min="10"
                  :step="1"
                >
                  <SliderTrack class="bg-background relative grow rounded-full h-[3px]">
                    <SliderRange class="absolute h-full rounded-full bg-primary" />
                  </SliderTrack>

                  <TooltipRoot disable-closing-trigger>
                    <TooltipTrigger as-child>
                      <SliderThumb
                        class="block w-5 h-5 bg-primary rounded-[100px] hover:bg-primary focus:outline-hidden"
                        aria-label="Volume"
                      />
                    </TooltipTrigger>

                    <TooltipPortal>
                      <TooltipContent
                        class="px-2 py-1 text-xs font-semibold border rounded bg-card text-foreground border-muted"
                        :side-offset="6"
                        side="top"
                      >
                        <NumberFlow
                          v-if="sliderValue[0] != null"
                          locales="en-US"
                          will-change
                          :value="sliderValue[0]"
                          :plugins="[continuous]"
                          :opacity-timing="{
                            duration: 250,
                            easing: 'ease-out',
                          }"
                          :transform-timing="{
                            easing: `linear(0, 0.0033 0.8%, 0.0263 2.39%, 0.0896 4.77%, 0.4676 15.12%, 0.5688, 0.6553, 0.7274, 0.7862, 0.8336 31.04%, 0.8793, 0.9132 38.99%, 0.9421 43.77%, 0.9642 49.34%, 0.9796 55.71%, 0.9893 62.87%, 0.9952 71.62%, 0.9983 82.76%, 0.9996 99.47%)`,
                            duration: 500,
                          }"
                        />
                        %
                      </TooltipContent>
                    </TooltipPortal>
                  </TooltipRoot>
                </SliderRoot>
              </TooltipProvider>
            </PopoverContent>
          </PopoverPortal>
        </PopoverRoot>
      </div>
      <div
        class="focus:ring-primary! DeleteImage z-50 focus:ring-2! print:hidden  text-foreground size-9 bg-secondary  flex justify-center items-center"
      >
        <button
          v-if="isGif"
          class="absolute top-0 z-30 flex items-center justify-center right-10 size-9 bg-secondary focus-within:bg-secondary focus-within:text-secondary-foreground focus-within:outlined focus-within:outline-dashed focus-within:-outline-offset-4 focus-within:outline-primary text-foreground"
          aria-label="Pause Gif"
          @click="togglePause()"
        >
          <Play v-if="isPaused" class="size-4" />
          <div v-else class="size-4 flex gap-1 rounded justify-center items-center">
            <svg class="size-3 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 41.12 56.2"><path d="M0 0h11.01v56.2H0zM30.11 0h11.01v56.2H30.11z" /></svg>
          </div>
        </button>
        <button aria-label="Delete image" class="flex items-center justify-center size-9 bg-secondary text-foreground focus-within:bg-secondary focus-within:text-secondary-foreground focus-within:outlined focus-within:outline-dashed focus-within:-outline-offset-4 focus-within:outline-primary" @click="deleteNode()">
          <Trash class="size-4" />
          <span class="sr-only">Delete</span>
        </button>
      </div>
    </div>

    <div class="relative flex w-full">
      <div v-if="editable" class="relative flex w-full bg-background">
        <div
          v-if="mediaType === 'img'"
          :class="[
            `flex w-full ${(isAlign && `justify-${props.node.attrs.dataAlign}`) || ''}`,
          ]"
        >
          <img
            v-show="!isPaused"
            v-bind="node.attrs"
            ref="resizableImg"
            alt=""
          >
          <canvas
            v-show="isPaused"
            v-if="isGif"
            ref="canvasRef"
            :style="`width: ${props.node.attrs.width}`"
            class="w-full h-auto"
          />
        </div>

        <div
          v-else-if="mediaType === 'video'" class="relative flex w-full"
          :class="[
            `${(isAlign && `justify-${props.node.attrs.dataAlign}`) || ''}`,
          ]"
        >
          <div
            class="relative" :style="[
              `${(`width: ${props.node.attrs.width}`)}`,
            ]"
          >
            <span class="absolute inset-0 flex items-center justify-center">
              <IconVideo class="size-12" />
            </span>
            <video
              v-bind="node.attrs"
              ref="resizableImg"
              class="w-full opacity-80"
              alt=""
              draggable="true"
            >
              <source :src="node.attrs.src">
            </video>
          </div>
        </div>
      </div>

      <div
        v-show="!editable" class="relative previewImage flex w-full"
        :class="[
          `${(isAlign && `justify-${props.node.attrs.dataAlign}`) || ''}`,
        ]"
      >
        <img
          v-if="mediaType === 'img'"
          v-bind="node.attrs"
          alt=""
          draggable="true"
        >

        <video
          v-else-if="mediaType === 'video'"
          v-bind="node.attrs"
          ref="resizableImg"
          class=""
          draggable="true"
          controls="true"
        >
          <source :src="node.attrs.src">
        </video>
        <DialogRoot v-if="mediaType === 'img'">
          <DialogTrigger
            class="ExpandImageTrigger flex items-center justify-center absolute right-0 transition-opacity duration-300 top-0 size-9 bg-secondary text-foreground focus-within:bg-secondary focus-within:text-secondary-foreground focus-within:outlined focus-within:outline-dashed focus-within:-outline-offset-4 focus-within:outline-primary "
          >
            <Expand class="size-5" />
          </DialogTrigger>
          <DialogPortal>
            <DialogOverlay class="bg-background/80 grid place-items-center fixed inset-0 z-[120] max-h-screen p-2 overflow-y-auto">
              <DialogContent
                class=" p-1 focus:outline-hidden"
              >
                <DialogTitle class="sr-only">
                  Images fullscreen
                </DialogTitle>
                <DialogDescription class="sr-only">
                  This shows the image in fullscreen
                </DialogDescription>
                <div class="max-w-7xl mx-auto">
                  <img
                    v-if="mediaType === 'img'"
                    v-bind="node.attrs"
                    alt=""
                    class="mx-auto"
                  >
                </div>
                <DialogClose class="fixed top-0 size-6 flex justify-center items-center m-3 right-3 z-999 text-foreground">
                  <X class="size-6" />
                  <span class="sr-only">{{ t('verb.close') }}</span>
                </DialogClose>
              </DialogContent>
            </DialogOverlay>
          </DialogPortal>
        </DialogRoot>
      </div>
    </div>
  </NodeViewWrapper>
</template>

<style>
@reference "@/assets/main.css";

.media-node-view {
  position: relative;
}

.SliderRoot:has([data-state="delayed-open"]) ~ .NumberFieldRoot,
.SliderRoot:has([data-state="instant-open"]) ~ .NumberFieldRoot {
  @apply hidden!
}

.media-node-view.f-left {
  @apply float-left;
}

.media-node-view.f-right {
  @apply float-right;
}

.media-node-view.align-left {
  @apply justify-start;
}

.media-node-view.align-center {
  @apply justify-center;
}

.media-node-view.align-right {
  @apply justify-end;
}

.image-actions-container {
  @apply flex gap-1;
}

.media-actions-container {
  padding: 4px !important;
  width: fit-content !important;

  .ep-button + .ep-button {
    margin-left: 0px;
  }
}

.is-editable video {
  pointer-events: none;
}

.is-preview .tiptap .ProseMirror-selectednode {
  @apply ring-0;
}

.previewImage .ExpandImageTrigger {
  opacity: 0;
}
.previewImage:hover .ExpandImageTrigger {
  opacity: 1;
}
</style>
