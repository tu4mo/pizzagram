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

      resolve(canvas.toDataURL('image/png'))
    }

    image.onerror = (err) => {
      reject(err)
    }

    image.src = fileResult
  })
}

export async function rotate(
  fileResult: string,
  degrees: number,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new Image()

    image.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        reject(new Error('Could not get canvas context'))
        return
      }

      const { width, height } = image

      canvas.width = width
      canvas.height = height

      ctx.translate(width / 2, height / 2)
      ctx.rotate((degrees * Math.PI) / 180)
      ctx.drawImage(image, -width / 2, -height / 2)

      resolve(canvas.toDataURL('image/png'))
    }

    image.onerror = (err) => {
      reject(err)
    }

    image.src = fileResult
  })
}
