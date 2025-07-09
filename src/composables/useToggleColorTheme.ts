import { useStorage } from '@vueuse/core'

const colorTheme = useStorage('theme', 'theme-foreground')

export function useToggleColorTheme(theme: string) {
  document.body.classList.remove(colorTheme.value)
  document.body.classList.add(theme)
  colorTheme.value = theme
}
