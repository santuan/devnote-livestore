import { AlignCenterVertical, AlignEndVertical, AlignStartVertical } from 'lucide-vue-next'

interface ResizableMediaAction {
  tooltip: string
  icon: any
  action?: (updateAttributes: (o: Record<string, any>) => any) => void
  isActive?: (attrs: Record<string, any>) => boolean
  delete?: (d: () => void) => void
}

export const resizableMediaActions: ResizableMediaAction[] = [
  {
    tooltip: 'start',
    action: updateAttributes =>
      updateAttributes({
        dataAlign: 'start',
        dataFullWidth: null,
      }),
    icon: AlignStartVertical,
    isActive: attrs => attrs.dataAlign === 'start',
  },
  {
    tooltip: 'center',
    action: updateAttributes =>
      updateAttributes({
        dataAlign: 'center',
        dataFullWidth: null,
      }),
    icon: AlignCenterVertical,
    isActive: attrs => attrs.dataAlign === 'center',
  },
  {
    tooltip: 'end',
    action: updateAttributes =>
      updateAttributes({
        dataAlign: 'end',
        dataFullWidth: null,
      }),
    icon: AlignEndVertical,
    isActive: attrs => attrs.dataAlign === 'end',
  },
]
