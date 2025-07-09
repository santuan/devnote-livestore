<script setup lang="ts">
import { useStorage } from '@vueuse/core'

import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from 'reka-ui'
import { useI18n } from 'vue-i18n'
import Tooltip from '@/components/Tooltip.vue'

const { t, locale } = useI18n()
const storedLocale = useStorage('locale', 'es')

function setLocale(lang: any) {
  locale.value = lang
  storedLocale.value = lang
}
</script>

<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger
      class="flex items-center justify-center border interactive border-secondary hover:bg-secondary/80 bg-background size-8"
    >
      <Tooltip :name="t('settings.language')" side="top" align="end">
        <span class="size-8 flex justify-center uppercase items-center">
          {{ locale }}
        </span>
        <span class="sr-only"> {{ t('settings.languageDescription') }}</span>
      </Tooltip>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      side="left"
      align="start"
      class="z-10 grid w-32 text-xs bg-secondary border border-primary"
    >
      <DropdownMenuItem
        class="p-2 hover:bg-secondary-foreground/10 outline-hidden focus:ring-1 focus:ring-primary focus:bg-primary/20 focus:ring-inset"
        @click="setLocale('de')"
      >
        Deutsch
      </DropdownMenuItem>
      <DropdownMenuItem
        class="p-2 hover:bg-secondary-foreground/10 outline-hidden focus:ring-1 focus:ring-primary focus:bg-primary/20 focus:ring-inset"
        @click="setLocale('en')"
      >
        English
      </DropdownMenuItem>
      <DropdownMenuItem
        class="p-2 hover:bg-secondary-foreground/10 outline-hidden focus:ring-1 focus:ring-primary focus:bg-primary/20 focus:ring-inset"
        @click="setLocale('es')"
      >
        Español
      </DropdownMenuItem>
      <DropdownMenuItem
        class="p-2 hover:bg-secondary-foreground/10 outline-hidden focus:ring-1 focus:ring-primary focus:bg-primary/20 focus:ring-inset"
        @click="setLocale('fr')"
      >
        Français
      </DropdownMenuItem>
      <DropdownMenuItem
        class="p-2 hover:bg-secondary-foreground/10 outline-hidden focus:ring-1 focus:ring-primary focus:bg-primary/20 focus:ring-inset"
        @click="setLocale('ja')"
      >
        日本語
      </DropdownMenuItem>
      <DropdownMenuItem
        class="p-2 hover:bg-secondary-foreground/10 outline-hidden focus:ring-1 focus:ring-primary focus:bg-primary/20 focus:ring-inset"
        @click="setLocale('ru')"
      >
        Русский
      </DropdownMenuItem>
      <DropdownMenuItem
        class="p-2 hover:bg-secondary-foreground/10 outline-hidden focus:ring-1 focus:ring-primary focus:bg-primary/20 focus:ring-inset"
        @click="setLocale('zh')"
      >
        简体中文
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenuRoot>
</template>
