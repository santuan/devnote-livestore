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
  label: string
  category: 'navigation' | 'editor' | 'layout' | 'mode'
}

export const COMMANDS: CommandMeta[] = [
  { id: 'toggleSidebar', label: 'Toggle Sidebar', category: 'navigation' },
  { id: 'toggleEditable', label: 'Toggle Edit Mode', category: 'mode' },
  { id: 'newDocument', label: 'New Document', category: 'editor' },
  { id: 'focusTitle', label: 'Focus Title', category: 'editor' },
  { id: 'focusEditor', label: 'Focus Editor', category: 'editor' },
  { id: 'focusLogo', label: 'Focus Logo', category: 'navigation' },
  { id: 'toggleSecondarySidebar', label: 'Toggle Secondary Sidebar', category: 'navigation' },
  { id: 'navigateNextDocument', label: 'Next Document', category: 'navigation' },
  { id: 'navigatePreviousDocument', label: 'Previous Document', category: 'navigation' },
  { id: 'windowLayout1', label: 'Layout: 40/20/40', category: 'layout' },
  { id: 'windowLayout2', label: 'Layout: 5/65/30', category: 'layout' },
  { id: 'windowLayout3', label: 'Layout: 30/65/5', category: 'layout' },
  { id: 'windowLayout4', label: 'Layout: 15/70/15', category: 'layout' },
  { id: 'windowLayout5', label: 'Layout: 5/90/5', category: 'layout' },
  { id: 'focusMode', label: 'Toggle Focus Mode', category: 'mode' },
  { id: 'selectSideTab1', label: 'Side Tab: Format', category: 'navigation' },
  { id: 'selectSideTab2', label: 'Side Tab: Document', category: 'navigation' },
  { id: 'selectSideTab3', label: 'Side Tab: Settings', category: 'navigation' },
  { id: 'openKeybindingPanel', label: 'Open Keybinding Settings', category: 'mode' },
  { id: 'openCommandMenu', label: 'Open Command Menu', category: 'navigation' },
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
