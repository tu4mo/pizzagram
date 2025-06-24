export async function crop(
  fileResult: string,
  outputSize: number,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new Image()

    image.onload = () => {
      let newWidth, newHeight, xOffset, yOffset

      const aspectRatio = image.width / image.height

      if (aspectRatio > 1) {
        newHeight = outputSize
        newWidth = newHeight * aspectRatio
        xOffset = -Math.abs((outputSize - newWidth) / 2)
        yOffset = 0
      } else {
        newWidth = outputSize
        newHeight = newWidth / aspectRatio
        xOffset = 0
        yOffset = -Math.abs((outputSize - newHeight) / 2)
      }

      const canvas = document.createElement('canvas')
      canvas.width = outputSize
      canvas.height = outputSize

      const ctx = canvas.getContext('2d')

      if (!ctx) {
        reject(new Error('Could not get canvas context'))
        return
      }

      ctx.drawImage(image, xOffset, yOffset, newWidth, newHeight)

      const croppedImage = canvas.toDataURL('image/webp')
      resolve(croppedImage)
    }

    image.onerror = (err) => {
      reject(err)
    }

    image.src = fileResult
  })
}
