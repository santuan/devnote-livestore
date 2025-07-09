<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Ripple from '@/components/Inspira/Ripple/Ripple.vue'

const { t } = useI18n()
</script>

<template>
  <div class="fixed flex bg-red-600 duration-1000 justify-center items-center inset-0">
    <span class="sr-only">{{ t('message.clickToEdit') }}</span>
    <Ripple class="transition-opacity duration-1000 " />
  </div>
</template>
