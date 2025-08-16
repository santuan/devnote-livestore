<script setup lang="ts">
import type { Ref } from 'vue'
import { useMagicKeys, whenever } from '@vueuse/core'
import { inject } from 'vue'

const sidebar_documents_splitter_ref = inject('sidebar_documents_splitter') as Ref<any>
const sidebar_secondary_splitter_ref = inject('sidebar_secondary_splitter') as Ref<any>
const layout = inject('layout') as Ref<any>

function windowLayout25() {
  if (!layout.value)
    return
  sidebar_documents_splitter_ref.value.resize(25)
  sidebar_secondary_splitter_ref.value.resize(25)
}

function windowLayoutOne() {
  if (!layout.value)
    return
  sidebar_documents_splitter_ref.value.resize(30)
  sidebar_secondary_splitter_ref.value.resize(30)
}

function windowLayoutTwo() {
  if (!layout.value)
    return
  sidebar_documents_splitter_ref.value.resize(5)
  sidebar_secondary_splitter_ref.value.resize(50)
}

function windowLayoutThree() {
  if (!layout.value)
    return
  sidebar_documents_splitter_ref.value.resize(50)
  sidebar_secondary_splitter_ref.value.resize(5)
}

function windowLayoutFour() {
  if (!layout.value)
    return
  sidebar_documents_splitter_ref.value.resize(15)
  sidebar_secondary_splitter_ref.value.resize(15)
}

function windowLayoutFive() {
  if (!layout.value)
    return
  sidebar_documents_splitter_ref.value.resize(5)
  sidebar_secondary_splitter_ref.value.resize(5)
}

// Add these keyboard shortcut definitions after your existing magic key definitions
const keys = useMagicKeys()

const magic_window_layout_one = keys['ctrl+shift+alt+Digit1']
whenever(magic_window_layout_one, (n) => {
  if (n === true) {
    windowLayoutOne()
  }
})

const magic_window_layout_two = keys['ctrl+shift+alt+Digit4']
whenever(magic_window_layout_two, (n) => {
  if (n === true) {
    windowLayoutTwo()
  }
})

const magic_window_layout_three = keys['ctrl+shift+alt+Digit5']
whenever(magic_window_layout_three, (n) => {
  if (n === true) {
    windowLayoutThree()
  }
})

const magic_window_layout_four = keys['ctrl+shift+alt+Digit2']
whenever(magic_window_layout_four, (n) => {
  if (n === true) {
    windowLayoutFour()
  }
})

const magic_window_layout_five = keys['ctrl+shift+alt+Digit3']
whenever(magic_window_layout_five, (n) => {
  if (n === true) {
    windowLayoutFive()
  }
})
</script>

<template>
  <div class="grid gap-2 grid-cols-2 @xs:pl-0 pl-2 @xs:grid-cols-3">
    <button
      class="flex gap-px outline-1 outline-primary text-xs items-center justify-center text-center w-full bg-secondary/80"
      @click="windowLayoutOne()"
    >
      <span
        class="bg-secondary/30 flex justify-center items-center h-6 w-[30%]"
      />
      <span
        class="bg-primary/10 ring-1 ring-primary/40 text-primary flex justify-center items-center h-6 w-[40%]"
      >40%</span>
      <span
        class="bg-secondary/30 flex justify-center items-center h-6 w-[30%]"
      />
    </button>
    <button
      class="flex gap-px outline-1 outline-primary text-xs items-center justify-center text-center w-full bg-secondary/80"
      @click="windowLayout25()"
    >
      <span
        class="bg-secondary/30 flex justify-center items-center h-6 w-[30%]"
      />
      <span
        class="bg-primary/10 ring-1 ring-primary/40 text-primary flex justify-center items-center h-6 w-[40%]"
      >50%</span>
      <span
        class="bg-secondary/30 flex justify-center items-center h-6 w-[30%]"
      />
    </button>
    <button
      class="flex gap-px outline-1 outline-primary text-xs items-center justify-center text-center w-full bg-secondary/80"
      @click="windowLayoutFour()"
    >
      <span
        class="bg-secondary/30 flex justify-center items-center h-6 w-[15%]"
      />
      <span
        class="bg-primary/10 ring-1 ring-primary/40 text-primary flex justify-center items-center h-6 w-[70%]"
      >70%</span>
      <span
        class="bg-secondary/30 flex justify-center items-center h-6 w-[15%]"
      />
    </button>
    <button
      class="flex gap-px outline-1 outline-primary text-xs items-center justify-center text-center w-full bg-secondary/80"
      @click="windowLayoutFive()"
    >
      <span
        class="bg-secondary/30 flex justify-center items-center h-6 w-[5%]"
      />
      <span
        class="bg-primary/10 ring-1 ring-primary/40 text-primary flex justify-center items-center h-6 w-[90%]"
      >90%</span>
      <span
        class="bg-secondary/30 flex justify-center items-center h-6 w-[5%]"
      />
    </button>
    <button
      class="flex gap-px outline-1 outline-primary text-xs items-center justify-center text-center w-full bg-secondary/80"
      @click="windowLayoutTwo()"
    >
      <span
        class="bg-secondary/30 flex justify-center items-center h-6 w-[5%]"
      />
      <span
        class="bg-primary/10 ring-1 ring-primary/40 text-primary flex justify-center items-center h-6 w-[65%]"
      >65%</span>
      <span
        class="bg-secondary/30 flex justify-center items-center h-6 w-[30%]"
      />
    </button>
    <button
      class="flex gap-px outline-1 outline-primary text-xs items-center justify-center text-center w-full bg-secondary/80"
      @click="windowLayoutThree()"
    >
      <span
        class="bg-secondary/30 flex justify-center items-center h-6 w-[30%]"
      />
      <span
        class="bg-primary/10 ring-1 ring-primary/40 text-primary flex justify-center items-center h-6 w-[65%]"
      >65%</span>
      <span
        class="bg-secondary/30 flex justify-center items-center h-6 w-[5%]"
      />
    </button>
  </div>
</template>
