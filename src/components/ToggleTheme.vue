<script setup lang="ts">
import { useColorMode } from '@vueuse/core'
import { Moon, SunMedium } from 'lucide-vue-next'
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'reka-ui'
import { useI18n } from 'vue-i18n'
import { useToggleColorTheme } from '@/composables/useToggleColorTheme'

const mode = useColorMode()
const { t } = useI18n()
</script>

<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger class="interactive relative group">
      <span
        class="flex items-center justify-center border hover:bg-secondary/80 border-secondary group-data-[state=open]:text-primary bg-background size-8"
      >
        <Moon class="scale-0 rotate-0 size-4 dark:scale-100" />
        <SunMedium class="absolute rotate-90 size-4 scale-100 dark:scale-0" />
        <span class="sr-only">{{ t("settings.themeDescription") }}</span>
      </span>
    </DropdownMenuTrigger>
    <DropdownMenuPortal>
      <DropdownMenuContent
        class="z-10 grid w-64 text-xs font-mono text-foreground bg-background border border-primary"
        :side-offset="5"
        :align="'end'"
        :side="'bottom'"
      >
        <DropdownMenuGroup class="grid grid-cols-3">
          <DropdownMenuItem
            class="p-2 text-center hover:bg-secondary-foreground/10 outline-hidden focus:ring-1 focus:ring-primary focus:bg-primary/20 focus:ring-inset"
            @click="mode = 'light'"
          >
            {{ t("settings.light") }}
          </DropdownMenuItem>
          <DropdownMenuItem
            class="p-2 text-center hover:bg-secondary-foreground/10 outline-hidden focus:ring-1 focus:ring-primary focus:bg-primary/20 focus:ring-inset"
            @click="mode = 'dark'"
          >
            {{ t("settings.dark") }}
          </DropdownMenuItem>
          <DropdownMenuItem
            class="p-2 text-center hover:bg-secondary-foreground/10 outline-hidden focus:ring-1 focus:ring-primary focus:bg-primary/20 focus:ring-inset"
            @click="mode = 'auto'"
          >
            {{ t("settings.system") }}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator class="border-primary/20 border-t" />
        <DropdownMenuLabel
          class="px-3 flex gap-2 pt-2 justify-center text-xs text-center text-foreground/80"
        >
          {{ t("settings.selectPrimaryColor") }}
        </DropdownMenuLabel>
        <DropdownMenuGroup class="flex justify-evenly my-2 gap-0 items-center w-full p-1">
          <DropdownMenuItem
            class="outline-hidden size-5 bg-rose-500 data-highlighted:opacity-100! hover:ring-4 focus-visible:ring-4 ring-foreground ring-offset-0 opacity-30"
            @click="useToggleColorTheme('theme-rose')"
          >
            <span class="sr-only">{{ t("settings.theme") }} rose</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            class="bg-blue-500 outline-hidden data-highlighted:opacity-100! size-5 hover:ring-4 focus-visible:ring-4 ring-foreground ring-offset-0 opacity-30"
            @click="useToggleColorTheme('theme-blue')"
          >
            <span class="sr-only">{{ t("settings.theme") }} blue</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            class="bg-green-500 outline-hidden data-highlighted:opacity-100! size-5 hover:ring-4 focus-visible:ring-4 ring-foreground ring-offset-0 opacity-30"
            @click="useToggleColorTheme('theme-green')"
          >
            <span class="sr-only">{{ t("settings.theme") }} green</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            class="bg-yellow-500 outline-hidden data-highlighted:opacity-100! size-5 hover:ring-4 focus-visible:ring-4 ring-foreground ring-offset-0 opacity-30"
            @click="useToggleColorTheme('theme-yellow')"
          >
            <span class="sr-only">{{ t("settings.theme") }} yellow</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            class="outline-hidden data-highlighted:opacity-100! size-5 bg-violet-500 hover:ring-4 focus-visible:ring-4 ring-foreground ring-offset-0 opacity-30"
            @click="useToggleColorTheme('theme-violet')"
          >
            <span class="sr-only">{{ t("settings.theme") }} violet</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            class="outline-hidden! data-highlighted:opacity-100! size-4 bg-foreground/90 hover:ring-4 focus-visible:ring-4 ring-foreground ring-offset-0 opacity-30"
            @click="useToggleColorTheme('theme-foreground')"
          >
            <span class="sr-only">{{ t("settings.theme") }} Foreground</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>
