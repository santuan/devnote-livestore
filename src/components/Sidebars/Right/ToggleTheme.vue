<script setup lang="ts">
import { Check } from 'lucide-vue-next'
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'reka-ui'
import { useI18n } from 'vue-i18n'
import {
  colorTheme,
  useToggleColorTheme,
} from '@/composables/useToggleColorTheme'

const { t } = useI18n()

const darkThemes = [
  { id: 'theme-catppuccin', label: 'Catppuccin', color: '#CBA6F7' },
  { id: 'theme-terminal', label: 'Terminal', color: '#4A9EFF' },
  { id: 'theme-tokyo-night', label: 'Tokyo Night', color: '#7AA2F7' },
  { id: 'theme-dracula', label: 'Dracula', color: '#BD93F9' },
  { id: 'theme-nord', label: 'Nord', color: '#88C0D0' },
  { id: 'theme-gruvbox', label: 'Gruvbox', color: '#D79921' },
  { id: 'theme-one-dark', label: 'One Dark', color: '#61AFEF' },
  { id: 'theme-solarized', label: 'Solarized', color: '#268BD2' },
  { id: 'theme-kanagawa', label: 'Kanagawa', color: '#7E9CD8' },
  { id: 'theme-rose-pine', label: 'Rose Pine', color: '#C4A7E7' },
  { id: 'theme-vesper', label: 'Vesper', color: '#FFC799' },
]

const lightThemes = [
  { id: 'theme-catppuccin-latte', label: 'Catppuccin Latte', color: '#1E66F5' },
  { id: 'theme-tokyo-night-day', label: 'Tokyo Day', color: '#2E7DE9' },
  { id: 'theme-gruvbox-light', label: 'Gruvbox Light', color: '#076678' },
  { id: 'theme-one-light', label: 'One Light', color: '#4078F2' },
  { id: 'theme-solarized-light', label: 'Solarized Light', color: '#268BD2' },
  { id: 'theme-kanagawa-lotus', label: 'Kanagawa Lotus', color: '#4D699B' },
  { id: 'theme-rose-pine-dawn', label: 'Rose Pine Dawn', color: '#907AA9' },
]

function activeSwatch() {
  if (colorTheme.value === 'theme-foreground')
    return 'var(--foreground)'
  const all = [...darkThemes, ...lightThemes]
  return all.find(th => th.id === colorTheme.value)?.color ?? 'var(--foreground)'
}
</script>

<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger class="interactive relative group">
      <span
        class="flex items-center justify-center border hover:bg-secondary/80 border-secondary group-data-[state=open]:text-primary bg-background size-7"
      >
        <span
          class="size-3 ring-1 ring-foreground/20"
          :style="{ backgroundColor: activeSwatch() }"
        />
        <span class="sr-only">{{ t("settings.themeDescription") }}</span>
      </span>
    </DropdownMenuTrigger>
    <DropdownMenuPortal>
      <DropdownMenuContent
        class="z-10 grid w-64 text-xs font-mono text-foreground bg-background border border-primary max-h-96 overflow-y-auto"
        :side-offset="5"
        :align="'end'"
        :side="'bottom'"
      >
        <DropdownMenuLabel
          class="px-3 flex gap-2 pt-2 justify-center text-xs text-center text-foreground/80"
        >
          {{ t("settings.selectPrimaryColor") }}
        </DropdownMenuLabel>

        <DropdownMenuItem
          class="flex items-center gap-2 px-3 py-1.5 outline-hidden cursor-pointer hover:bg-secondary-foreground/10 focus:bg-primary/20 focus:ring-1 focus:ring-inset focus:ring-primary"
          @select="useToggleColorTheme('theme-foreground')"
        >
          <span class="size-4 bg-foreground/90 shrink-0" />
          <span class="flex-1">Foreground</span>
          <Check v-if="colorTheme === 'theme-foreground'" class="size-3 text-primary" />
        </DropdownMenuItem>

        <DropdownMenuSeparator class="border-primary/20 border-t my-1" />
        <DropdownMenuLabel class="px-3 text-xs font-medium text-foreground/60">
          Dark
        </DropdownMenuLabel>
        <DropdownMenuItem
          v-for="theme in darkThemes"
          :key="theme.id"
          class="flex items-center gap-2 px-3 py-1.5 outline-hidden cursor-pointer hover:bg-secondary-foreground/10 focus:bg-primary/20 focus:ring-1 focus:ring-inset focus:ring-primary"
          @select="useToggleColorTheme(theme.id)"
        >
          <span
            class="size-4 ring-1 ring-foreground/20 shrink-0"
            :style="{ backgroundColor: theme.color }"
          />
          <span class="flex-1">{{ theme.label }}</span>
          <Check v-if="colorTheme === theme.id" class="size-3 text-primary" />
        </DropdownMenuItem>

        <DropdownMenuSeparator class="border-primary/20 border-t my-1" />
        <DropdownMenuLabel class="px-3 text-xs font-medium text-foreground/60">
          Light
        </DropdownMenuLabel>
        <DropdownMenuItem
          v-for="theme in lightThemes"
          :key="theme.id"
          class="flex items-center gap-2 px-3 py-1.5 outline-hidden cursor-pointer hover:bg-secondary-foreground/10 focus:bg-primary/20 focus:ring-1 focus:ring-inset focus:ring-primary"
          @select="useToggleColorTheme(theme.id)"
        >
          <span
            class="size-4 ring-1 ring-foreground/20 shrink-0"
            :style="{ backgroundColor: theme.color }"
          />
          <span class="flex-1">{{ theme.label }}</span>
          <Check v-if="colorTheme === theme.id" class="size-3 text-primary" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>
