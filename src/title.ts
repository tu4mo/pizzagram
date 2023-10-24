import { onActivated } from 'vue'

function setDocumentTitle(title?: string) {
  document.title = title ? `${title} - Pizzagram` : 'Pizzagram'
}

export function setTitle(title?: string, skipLifecycle = false) {
  if (skipLifecycle) {
    setDocumentTitle(title)
    return
  }

  onActivated(() => {
    setDocumentTitle(title)
  })
}
