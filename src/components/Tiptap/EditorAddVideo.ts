import { mergeAttributes, Node } from '@tiptap/core'

const Video = Node.create({
  name: 'video', // unique name for the Node
  group: 'block', // belongs to the 'block' group of extensions
  selectable: true, // so we can select the video
  draggable: true, // so we can drag the video
  atom: true, // is a single unit

  addAttributes() {
    return {
      src: {
        default: null,
      },
      autoplay: {
        default: true,
      },
      controls: {
        default: true,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'video',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['video', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return ({ editor, node }) => {
      const div = document.createElement('div')
      div.className = `aspect-w-16 aspect-h-9${editor.isEditable ? ' ' : ''}`
      const iframe = document.createElement('iframe')
      if (editor.isEditable) {
        iframe.className = 'pointer-events-none'
      }
      iframe.width = '640'
      iframe.height = '360'
      iframe.src = node.attrs.src
      div.append(iframe)
      return {
        dom: div,
      }
    }
  },
})

export default Video
