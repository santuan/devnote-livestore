<script setup lang="ts">
import type { Ref } from 'vue'
import { Plus } from 'lucide-vue-next'
import { inject } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  isEditing?: boolean
}>()

const emit = defineEmits<{
  (e: 'click'): void
}>()

const editable_id = inject('editable_id') as Ref<string | null>

const { t } = useI18n()
</script>

<template>
  <button
    :disabled="props.isEditing"
    class="disabled:bg-secondary disabled:border-secondary hover:bg-primary/80 border-primary border text-xs disabled:pointer-events-none disabled:text-secondary-foreground/20 gap-2 h-8 w-full bg-primary text-primary-foreground flex justify-center items-center"
    @click="emit('click')"
  >
    <Plus v-show="editable_id !== ''" class="size-3" />
    <span v-show="editable_id === ''" class="flex items-center gap-1 text-primary">
      * {{ t("sidebar.creatingNewDocument") }}
    </span>
    <span v-show="editable_id !== ''" class="font-bold text-primary-foreground">
      {{ t("sidebar.newDocument") }}
    </span>
  </button>
</template>
