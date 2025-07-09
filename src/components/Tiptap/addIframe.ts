import { mergeAttributes, Node } from '@tiptap/core'

export interface IframeOptions {
  allowFullscreen: boolean
  HTMLAttributes: {
    [key: string]: any
  }
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    iframe: {
      setIframe: (options: { src: string }) => ReturnType
      updateIframe: (src: string) => ReturnType
      toggleFullscreen: () => ReturnType
    }
  }
}

export default Node.create<IframeOptions>({
  name: 'iframe',
  group: 'block',
  atom: true,

  addOptions() {
    return {
      allowFullscreen: true,
      HTMLAttributes: {
        class: 'iframe-wrapper',
      },
    }
  },

  addAttributes() {
    return {
      src: {
        default: null,
      },
      frameborder: {
        default: 0,
      },
      allowfullscreen: {
        default: this.options.allowFullscreen,
        parseHTML: () => this.options.allowFullscreen,
      },
      fullscreen: {
        default: false,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'iframe',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const wrapperAttrs = {
      ...this.options.HTMLAttributes,
      class: this.options.HTMLAttributes.class + (HTMLAttributes.fullscreen ? ' fullscreen' : ''),
    }
    return ['div', wrapperAttrs, ['iframe', mergeAttributes(HTMLAttributes)]]
  },

  addNodeView() {
    return ({ editor, node, getPos }) => {
      const container = document.createElement('div')
      container.className = 'iframeContainer'

      const iframe = document.createElement('iframe')
      iframe.src = node.attrs.src
      iframe.frameBorder = String(node.attrs.frameborder)
      if (node.attrs.allowfullscreen) {
        iframe.setAttribute('allowfullscreen', '')
      }

      let isFullscreen = false

      // Create controls container
      const controlsContainer = document.createElement('div')
      controlsContainer.className = 'iframeControls'

      const editSVG = `<svg class="pointer-event-none" xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"><!-- Icon from Lucide by Lucide Contributors - https://github.com/lucide-icons/lucide/blob/main/LICENSE --><g fill="none" stroke="currentColor"  stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></g></svg>`

      const link = document.createElement('a')
      link.className = 'iframeTitle'
      link.textContent = node.attrs.src
      link.href = node.attrs.src
      link.target = '_blank'
      link.rel = 'noopener noreferrer'

      if (editor.isEditable) {
        const editButton = document.createElement('button')
        editButton.className = 'iframeEditButton'
        editButton.appendChild(createSVGElement(editSVG))
        // editButton.onclick = () => {
        //   const modal = useModalStore()
        //   modal.show_iframe_url_dialog = true
        //   modal.editing_iframe_pos = getPos()
        // }
        controlsContainer.appendChild(editButton)
      }

      const fullscreenButton = document.createElement('button')
      fullscreenButton.className = 'iframeFullscreenButton'

      const maximizeSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"><path fill="none" stroke="currentColor"  stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3m8 0h3a2 2 0 0 0 2-2v-3"/></svg>`

      const minimizeSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"><path fill="none" stroke="currentColor"  stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 14h6v6m10-10h-6V4m0 6l7-7M3 21l7-7"/></svg>`

      function createSVGElement(svgString: string): SVGSVGElement {
        const template = document.createElement('template')
        template.innerHTML = svgString.trim()
        return template.content.firstChild as SVGSVGElement
      }

      fullscreenButton.appendChild(createSVGElement(maximizeSVG))

      fullscreenButton.onclick = () => {
        isFullscreen = !isFullscreen
        if (isFullscreen) {
          container.classList.add('fullscreen')
          fullscreenButton.innerHTML = ''
          fullscreenButton.appendChild(createSVGElement(minimizeSVG))
        }
        else {
          container.classList.remove('fullscreen')
          fullscreenButton.innerHTML = ''
          fullscreenButton.appendChild(createSVGElement(maximizeSVG))
        }
      }

      // Append controls inside the controls container
      controlsContainer.appendChild(link)

      controlsContainer.appendChild(fullscreenButton)

      // Append controls container to main container
      container.appendChild(controlsContainer)

      container.appendChild(iframe)

      return { dom: container }
    }
  },

  addCommands() {
    return {
      setIframe:
        options =>
          ({ tr, dispatch }) => {
            const { selection } = tr
            const node = this.type.create(options)

            if (dispatch) {
              tr.replaceRangeWith(selection.from, selection.to, node)
            }
            return true
          },
      updateIframe:
        src =>
          ({ tr, dispatch }) => {
            const { selection } = tr
            if (dispatch) {
              tr.setNodeMarkup(selection.from, undefined, { src })
            }
            return true
          },
      toggleFullscreen:
        () =>
          ({ tr, dispatch, state }) => {
            const { selection } = tr
            const pos = selection.from
            const node = state.doc.nodeAt(pos)
            if (!node || node.type.name !== this.name) {
              return false
            }
            if (dispatch) {
              tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                fullscreen: !node.attrs.fullscreen,
              })
            }
            return true
          },
    }
  },
})
