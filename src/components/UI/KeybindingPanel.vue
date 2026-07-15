<script setup lang="ts">
import type { CommandId } from '@/composables/useKeybindingConfig'
import { RotateCcw, X } from 'lucide-vue-next'
import {
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  VisuallyHidden,
} from 'reka-ui'
import { onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import DropdownLanguage from '@/components/Sidebars/Right/DropdownLanguage.vue'
import ToggleTheme from '@/components/Sidebars/Right/ToggleTheme.vue'
import ButtonDeleteAllDocument from '@/components/UI/ButtonDeleteAllDocument.vue'
import {
  COMMANDS,
  useKeybindingConfig,
} from '@/composables/useKeybindingConfig'

const { t } = useI18n()

const { prefixKey, bindings, setPrefixKey, setBinding, resetToDefaults }
  = useKeybindingConfig()

const isOpen = ref(false)
const recordingTarget = ref<'prefix' | CommandId | null>(null)

function startRecordingPrefix() {
  recordingTarget.value = 'prefix'
}

function startRecordingCommand(commandId: CommandId) {
  recordingTarget.value = commandId
}

function isRecording() {
  return recordingTarget.value !== null
}

function isRecordingPrefix() {
  return recordingTarget.value === 'prefix'
}

function isRecordingCommand(commandId: CommandId) {
  return recordingTarget.value === commandId
}

function handleGlobalKeyDown(event: KeyboardEvent) {
  if (!isRecording())
    return

  // Skip modifier-only keys
  if (['Control', 'Alt', 'Shift', 'Meta'].includes(event.key))
    return

  event.preventDefault()
  event.stopPropagation()

  // Escape cancels recording
  if (event.key === 'Escape') {
    recordingTarget.value = null
    return
  }

  // Build key string
  const parts: string[] = []
  if (event.ctrlKey)
    parts.push('ctrl')
  if (event.altKey)
    parts.push('alt')
  if (event.shiftKey)
    parts.push('shift')
  if (event.metaKey)
    parts.push('meta')

  let key = event.key
  if (key === ' ')
    key = 'Space'

  if (!parts.includes(key.toLowerCase())) {
    parts.push(key)
  }

  const keyString = parts.join('+')

  if (recordingTarget.value === 'prefix') {
    setPrefixKey(keyString)
  }
  else if (recordingTarget.value !== null) {
    setBinding(recordingTarget.value, keyString)
  }

  recordingTarget.value = null
}

function formatKey(key: string): string {
  return key
    .replace('ctrl', 'Ctrl')
    .replace('alt', 'Alt')
    .replace('shift', 'Shift')
    .replace('meta', 'Cmd')
    .replace('Space', 'Space')
    .replace('ArrowLeft', '←')
    .replace('ArrowRight', '→')
    .replace('ArrowUp', '↑')
    .replace('ArrowDown', '↓')
    .split('+')
    .map(k => (k.length === 1 ? k.toUpperCase() : k))
    .join(' + ')
}

// Global listener for recording
window.addEventListener('keydown', handleGlobalKeyDown, true)

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeyDown, true)
})

defineExpose({
  open: () => {
    isOpen.value = true
  },
})
</script>

<template>
  <DialogRoot v-model:open="isOpen">
    <DialogPortal>
      <DialogOverlay class="bg-background/80 fixed inset-0 z-700" />
      <DialogContent
        class="fixed top-4 md:top-[10%] left-[50%] w-[90vw] max-w-lg translate-x-[-50%] text-sm overflow-hidden border bg-background border-muted-foreground/30 focus:outline-hidden z-701"
      >
        <VisuallyHidden>
          <DialogTitle class="text-foreground">
            Keybinding Settings
          </DialogTitle>
          <DialogDescription>
            Configure prefix key and command bindings
          </DialogDescription>
        </VisuallyHidden>

        <div
          class="p-4 border-b border-muted-foreground/30 flex items-center justify-between"
        >
          <h2 class="font-mono text-foreground text-sm font-bold">
            Keybinding Settings
          </h2>
          <button
            class="text-muted-foreground hover:text-foreground"
            @click="isOpen = false"
          >
            <X class="size-4" />
          </button>
        </div>

        <div class="p-4 max-h-[70vh] overflow-y-auto font-mono text-xs">
          <!-- Settings moved from SidebarSettings -->
          <div class="mb-3 pt-4 text-foreground space-y-3">
            <div class="flex items-center justify-between">
              <span>{{ t("settings.language") }}</span>
              <DropdownLanguage />
            </div>
            <div class="flex items-center justify-between">
              <span>{{ t("settings.theme") }}</span>
              <ToggleTheme />
            </div>
          </div>
          <!-- Prefix Key -->

          <!-- Commands -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="font-semibold text-foreground">Configure shortcuts</span>
            </div>
            <div class="flex items-center justify-between gap-4">
              <span class="text-muted-foreground">Prefix Key</span>
              <button
                class="px-3 py-1 border border-muted-foreground/30 hover:border-primary focus:border-primary outline-none  min-w-35 text-center"
                :class="isRecordingPrefix() ? 'border-primary' : ''"
                @click="startRecordingPrefix"
              >
                <span
                  v-if="isRecordingPrefix()"
                  class="text-primary flex gap-2 items-center"
                >
                  Press keys...
                  <span class="relative flex size-3">
                    <span
                      class="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"
                    />
                    <span
                      class="relative inline-flex size-3 rounded-full bg-primary"
                    />
                  </span>
                </span>
                <span v-else class="text-foreground">
                  {{ formatKey(prefixKey) }}
                </span>
              </button>
            </div>
            <div
              v-for="command in COMMANDS"
              :key="command.id"
              class="flex items-center justify-between gap-4"
            >
              <span class="text-muted-foreground">{{ command.label }}</span>
              <button
                class="px-3 py-1 border border-muted-foreground/30 hover:border-primary focus:border-primary outline-none min-w-35 text-center"
                :class="isRecordingCommand(command.id) ? 'border-primary' : ''"
                @click="startRecordingCommand(command.id)"
              >
                <span
                  v-if="isRecordingCommand(command.id)"
                  class="text-primary flex gap-2 items-center"
                >
                  Press keys...
                  <span class="relative flex size-3">
                    <span
                      class="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"
                    />
                    <span
                      class="relative inline-flex size-3 rounded-full bg-primary"
                    />
                  </span>
                </span>
                <span v-else class="text-foreground">
                  {{ formatKey(bindings[command.id] || "") }}
                </span>
              </button>
            </div>
          </div>

          <!-- Database Settings -->
          <div class="mt-6 pt-4 text-foreground border-t border-muted-foreground/30 space-y-3">
            <div class="flex items-center justify-between">
              <span class="font-semibold text-primary">{{ t("settings.database") }}</span>
            </div>
            <div class="pt-3 space-y-3 text-xs">
              <div class="flex gap-2 items-center justify-between w-full">
                <span class="text-destructive">{{ t("editor.deleteAll") }}</span>
                <ButtonDeleteAllDocument />
              </div>
            </div>
          </div>

          <!-- Reset -->
          <div class="mt-6 pt-4 border-t border-muted-foreground/30">
            <button
              class="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              @click="resetToDefaults"
            >
              <RotateCcw class="size-3" />
              Reset to defaults
            </button>
          </div>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
