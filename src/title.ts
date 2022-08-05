import { onActivated } from 'vue'

const documentTitle = (title?: string) => {
  document.title = title ? `${title} - Pizzagram` : 'Pizzagram'
}

export const setTitle = (title?: string, skipLifecycle = false) => {
  if (skipLifecycle) {
    documentTitle(title)
    return
  }

  onActivated(() => {
    documentTitle(title)
  })
}
