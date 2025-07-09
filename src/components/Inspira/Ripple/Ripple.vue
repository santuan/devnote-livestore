<script setup lang="ts">
import RippleCircle from './RippleCircle.vue'

interface Props {
  baseCircleSize?: number
  baseCircleOpacity?: number
  spaceBetweenCircle?: number
  circleOpacityDowngradeRatio?: number
  circleClass?: string
  waveSpeed?: number
  numberOfCircles?: number
}

withDefaults(defineProps<Props>(), {
  baseCircleSize: 210,
  baseCircleOpacity: 0.24,
  circleOpacityDowngradeRatio: 0.03,
  waveSpeed: 80,
  spaceBetweenCircle: 70,
  numberOfCircles: 7,
})
</script>

<template>
  <div class="absolute inset-0 w-full pointer-events-none flex justify-center items-center">
    <svg
      id="a"
      xmlns="http://www.w3.org/2000/svg"
      class="relative opacity-[0.9] w-44 h-44"
      viewBox="0 0 384 311.02"
    >
      <path
        d="M.52 127.66V0h37.95c8.63 0 16.12 1.66 22.47 4.98 6.35 3.32 11.28 7.96 14.78 13.9s5.25 12.94 5.25 20.98V87.6c0 8.04-1.75 15.07-5.25 21.07-3.5 6.01-8.42 10.67-14.78 13.99-6.36 3.32-13.85 4.98-22.47 4.98H.52Zm21.86-19.59h16.09c6.3 0 11.31-1.83 15.04-5.51 3.73-3.67 5.6-8.66 5.6-14.95V39.87c0-6.18-1.87-11.1-5.6-14.78-3.73-3.67-8.74-5.51-15.04-5.51H22.38v88.49ZM99.41 127.66v-19.24h158.22V71h-152.1V52.46h152.1V19.24H99.41V0h179.73v127.66H99.41ZM323.49 127.66 291.32 0h22.56l19.41 83.24c1.05 4.08 2.01 8.48 2.89 13.2.87 4.72 1.54 8.48 2.01 11.28.46-2.8 1.14-6.56 2.01-11.28.87-4.72 1.84-9.18 2.89-13.38L361.79 0H384l-32.18 127.66h-28.33ZM0 309.27V181.61h26.76l35.5 103.18c-.35-3.73-.7-8.13-1.05-13.2-.35-5.07-.67-10.23-.96-15.48-.29-5.24-.44-9.91-.44-13.99v-60.51h19.94v127.66H52.99L17.84 206.09c.23 3.38.52 7.46.87 12.24s.64 9.68.87 14.69c.23 5.02.35 9.62.35 13.82v62.43H0ZM137.8 311.02c-12.24 0-21.95-3.5-29.12-10.49-7.17-6.99-10.76-16.67-10.76-29.03v-52.11c0-12.36 3.59-22.03 10.76-29.03 7.17-6.99 16.88-10.49 29.12-10.49s21.95 3.5 29.12 10.49c7.17 7 10.76 16.61 10.76 28.86v52.29c0 12.36-3.59 22.04-10.76 29.03-7.17 6.99-16.88 10.49-29.12 10.49Zm0-19.24c5.95 0 10.43-1.6 13.47-4.81 3.03-3.21 4.55-7.78 4.55-13.73v-55.61c0-5.94-1.52-10.52-4.55-13.73-3.03-3.2-7.52-4.81-13.47-4.81s-10.44 1.61-13.47 4.81c-3.03 3.21-4.55 7.78-4.55 13.73v55.61c0 5.94 1.51 10.52 4.55 13.73 3.03 3.21 7.52 4.81 13.47 4.81ZM223.39 309.27v-107.9h-33.4v-19.76h88.84v19.76h-33.4v107.9H223.4ZM295.27 309.27V181.61h76.59v19.24h-55.08v33.23h48.97v18.54h-48.97v37.42h55.08v19.24h-76.59Z"
        class="fill-primary"
      />
    </svg>
    <RippleCircle
      v-for="index in numberOfCircles"
      :key="index"
      :opacity="baseCircleOpacity - index * circleOpacityDowngradeRatio"
      :size="baseCircleSize + index * spaceBetweenCircle"
      :animation-delay="index * waveSpeed"
      :border-style="index === numberOfCircles - 1 ? 'dashed' : 'solid'"
      :class="circleClass"
    />
  </div>
</template>
