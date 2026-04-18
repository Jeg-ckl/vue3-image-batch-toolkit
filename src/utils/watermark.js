export function addTextWatermark(file, text, options = {}) {
  const {
    fontSize = 24,
    color = 'rgba(0, 0, 0, 0.5)',
    x = 50,
    y = 50
  } = options

  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      ctx.font = `${fontSize}px Arial`
      ctx.fillStyle = color
      ctx.fillText(text, x, y)
      const outputType = file.type || 'image/jpeg'
      canvas.toBlob((blob) => {
        if (!blob) {
          resolve(file)
          return
        }
        resolve(new File([blob], file.name, { type: outputType }))
      }, outputType)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve(file)
    }
    img.src = url
  })
}

export function addImageWatermark(file, watermarkFile, options = {}) {
  const {
    opacity = 0.5,
    x = 50,
    y = 50,
    scale = 1
  } = options

  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const mainImg = new Image()
    const watermarkImg = new Image()
    const mainUrl = URL.createObjectURL(file)
    const watermarkUrl = URL.createObjectURL(watermarkFile)
    let loadedCount = 0
    let hasError = false

    const cleanup = () => {
      URL.revokeObjectURL(mainUrl)
      URL.revokeObjectURL(watermarkUrl)
    }

    const checkLoaded = () => {
      loadedCount++
      if (loadedCount === 2) {
        cleanup()
        canvas.width = mainImg.width
        canvas.height = mainImg.height
        ctx.drawImage(mainImg, 0, 0)
        ctx.globalAlpha = opacity
        const w = watermarkImg.width * scale
        const h = watermarkImg.height * scale
        ctx.drawImage(watermarkImg, x, y, w, h)
        ctx.globalAlpha = 1
        const outputType = file.type || 'image/jpeg'
        canvas.toBlob((blob) => {
          if (!blob) {
            resolve(file)
            return
          }
          resolve(new File([blob], file.name, { type: outputType }))
        }, outputType)
      }
    }

    const handleError = () => {
      if (!hasError) {
        hasError = true
        cleanup()
        resolve(file)
      }
    }

    mainImg.onload = checkLoaded
    watermarkImg.onload = checkLoaded
    mainImg.onerror = handleError
    watermarkImg.onerror = handleError
    mainImg.src = mainUrl
    watermarkImg.src = watermarkUrl
  })
}
