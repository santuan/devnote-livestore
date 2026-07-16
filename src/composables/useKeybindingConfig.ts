import { useStorage } from '@vueuse/core'
import { computed } from 'vue'

export type CommandId
  = | 'toggleSidebar'
    | 'toggleEditable'
    | 'newDocument'
    | 'focusTitle'
    | 'focusEditor'
    | 'focusLogo'
    | 'toggleSecondarySidebar'
    | 'navigateNextDocument'
    | 'navigatePreviousDocument'
    | 'windowLayout1'
    | 'windowLayout2'
    | 'windowLayout3'
    | 'windowLayout4'
    | 'windowLayout5'
    | 'focusMode'
    | 'selectSideTab1'
    | 'selectSideTab2'
    | 'selectSideTab3'
    | 'openKeybindingPanel'
    | 'openCommandMenu'

export interface CommandMeta {
  id: CommandId
  i18nKey: string
  category: 'navigation' | 'editor' | 'layout' | 'mode'
}

export const COMMANDS: CommandMeta[] = [
  { id: 'toggleSidebar', i18nKey: 'keybindings.commands.toggleSidebar', category: 'navigation' },
  { id: 'toggleEditable', i18nKey: 'keybindings.commands.toggleEditable', category: 'mode' },
  { id: 'newDocument', i18nKey: 'keybindings.commands.newDocument', category: 'editor' },
  { id: 'focusTitle', i18nKey: 'keybindings.commands.focusTitle', category: 'editor' },
  { id: 'focusEditor', i18nKey: 'keybindings.commands.focusEditor', category: 'editor' },
  { id: 'focusLogo', i18nKey: 'keybindings.commands.focusFirstDocument', category: 'navigation' },
  { id: 'toggleSecondarySidebar', i18nKey: 'keybindings.commands.toggleSecondarySidebar', category: 'navigation' },
  { id: 'navigateNextDocument', i18nKey: 'keybindings.commands.navigateNextDocument', category: 'navigation' },
  { id: 'navigatePreviousDocument', i18nKey: 'keybindings.commands.navigatePreviousDocument', category: 'navigation' },
  { id: 'windowLayout1', i18nKey: 'keybindings.commands.windowLayout1', category: 'layout' },
  { id: 'windowLayout2', i18nKey: 'keybindings.commands.windowLayout2', category: 'layout' },
  { id: 'windowLayout3', i18nKey: 'keybindings.commands.windowLayout3', category: 'layout' },
  { id: 'windowLayout4', i18nKey: 'keybindings.commands.windowLayout4', category: 'layout' },
  { id: 'windowLayout5', i18nKey: 'keybindings.commands.windowLayout5', category: 'layout' },
  { id: 'focusMode', i18nKey: 'keybindings.commands.focusMode', category: 'mode' },
  { id: 'selectSideTab1', i18nKey: 'keybindings.commands.selectSideTab1', category: 'navigation' },
  { id: 'selectSideTab2', i18nKey: 'keybindings.commands.selectSideTab2', category: 'navigation' },
  { id: 'selectSideTab3', i18nKey: 'keybindings.commands.selectSideTab3', category: 'navigation' },
  { id: 'openKeybindingPanel', i18nKey: 'keybindings.commands.openKeybindingPanel', category: 'mode' },
  { id: 'openCommandMenu', i18nKey: 'keybindings.commands.openCommandMenu', category: 'navigation' },
]

export interface KeybindingConfig {
  prefixKey: string
  bindings: Record<CommandId, string>
}

const DEFAULT_BINDINGS: Record<CommandId, string> = {
  toggleSidebar: 'm',
  toggleEditable: 'p',
  newDocument: 'n',
  focusTitle: 't',
  focusEditor: 'u',
  focusLogo: 'ArrowLeft',
  toggleSecondarySidebar: 'ArrowRight',
  navigateNextDocument: 'ArrowDown',
  navigatePreviousDocument: 'ArrowUp',
  windowLayout1: '1',
  windowLayout2: '2',
  windowLayout3: '3',
  windowLayout4: '4',
  windowLayout5: '5',
  focusMode: 'f',
  selectSideTab1: 'a',
  selectSideTab2: 's',
  selectSideTab3: 'd',
  openKeybindingPanel: 'k',
  openCommandMenu: 'o',
}

const DEFAULT_CONFIG: KeybindingConfig = {
  prefixKey: 'ctrl+Space',
  bindings: { ...DEFAULT_BINDINGS },
}

export function useKeybindingConfig() {
  const config = useStorage<KeybindingConfig>('keybinding-config', DEFAULT_CONFIG)

  const prefixKey = computed(() => config.value.prefixKey)
  const bindings = computed(() => config.value.bindings)

  function setPrefixKey(key: string) {
    config.value = { ...config.value, prefixKey: key }
  }

  function setBinding(commandId: CommandId, key: string) {
    config.value = {
      ...config.value,
      bindings: { ...config.value.bindings, [commandId]: key },
    }
  }

  function resetToDefaults() {
    config.value = { ...DEFAULT_CONFIG }
  }

  function getKeyForCommand(commandId: CommandId): string {
    return bindings.value[commandId] ?? ''
  }

  function getCommandForKey(key: string): CommandId | undefined {
    const entry = Object.entries(bindings.value).find(([, v]) => v === key)
    return entry ? (entry[0] as CommandId) : undefined
  }

  return {
    prefixKey,
    bindings,
    setPrefixKey,
    setBinding,
    resetToDefaults,
    getKeyForCommand,
    getCommandForKey,
  }
}
