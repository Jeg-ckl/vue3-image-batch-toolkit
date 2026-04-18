<template>
  <div class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
      <div class="flex items-center justify-between p-4 border-b">
        <h2 class="text-xl font-bold">图片编辑</h2>
        <button @click="close" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
      </div>

      <div class="flex flex-1 overflow-hidden">
        <div class="flex-1 p-4 bg-gray-100 flex items-center justify-center overflow-auto">
          <div ref="canvasContainer" class="bg-white shadow-lg"></div>
        </div>

        <div class="w-80 p-4 border-l overflow-y-auto">
          <div class="mb-6">
            <h3 class="font-semibold mb-3">裁剪比例</h3>
            <div class="grid grid-cols-4 gap-2">
              <button v-for="ratio in cropRatios" :key="ratio.value" @click="setCropRatio(ratio.value)"
                :class="['p-2 rounded border', currentCropRatio === ratio.value ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-300']">
                {{ ratio.label }}
              </button>
            </div>
          </div>

          <div class="mb-6">
            <h3 class="font-semibold mb-3">旋转</h3>
            <div class="flex gap-2">
              <button @click="rotate(-90)" class="flex-1 p-2 rounded border border-gray-300 hover:bg-gray-50">↺ 90°</button>
              <button @click="rotate(90)" class="flex-1 p-2 rounded border border-gray-300 hover:bg-gray-50">↻ 90°</button>
            </div>
          </div>

          <div class="mb-6">
            <h3 class="font-semibold mb-3">翻转</h3>
            <div class="flex gap-2">
              <button @click="flip('h')" class="flex-1 p-2 rounded border border-gray-300 hover:bg-gray-50">⇆ 水平</button>
              <button @click="flip('v')" class="flex-1 p-2 rounded border border-gray-300 hover:bg-gray-50">⇅ 垂直</button>
            </div>
          </div>

          <div class="mb-6">
            <h3 class="font-semibold mb-3">文字水印</h3>
            <input v-model="watermarkText" type="text" placeholder="输入水印文字" class="w-full p-2 border rounded mb-2" />
            <div class="flex gap-2">
              <button @click="addTextWatermark" class="flex-1 p-2 bg-blue-500 text-white rounded hover:bg-blue-600">添加文字</button>
            </div>
          </div>

          <div class="mb-6">
            <h3 class="font-semibold mb-3">图片水印</h3>
            <input ref="watermarkInput" type="file" accept="image/*" @change="handleWatermarkFile" class="w-full p-2 border rounded mb-2" />
          </div>

          <div class="mb-6">
            <h3 class="font-semibold mb-3">亮度</h3>
            <input v-model.number="brightness" type="range" min="-100" max="100" @input="applyFilters" class="w-full" />
            <span>{{ brightness }}</span>
          </div>

          <div class="mb-6">
            <h3 class="font-semibold mb-3">对比度</h3>
            <input v-model.number="contrast" type="range" min="-100" max="100" @input="applyFilters" class="w-full" />
            <span>{{ contrast }}</span>
          </div>

          <div class="mb-6">
            <h3 class="font-semibold mb-3">圆角</h3>
            <input v-model.number="borderRadius" type="range" min="0" max="100" @input="applyBorderRadius" class="w-full" />
            <span>{{ borderRadius }}px</span>
          </div>
        </div>
      </div>

      <div class="flex justify-end gap-3 p-4 border-t">
        <button @click="close" class="px-6 py-2 border rounded-lg hover:bg-gray-50">取消</button>
        <button @click="save" class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">保存</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { fabric } from 'fabric'

const props = defineProps({
  image: Object
})

const emit = defineEmits(['close', 'save'])

const canvasContainer = ref(null)
const watermarkInput = ref(null)
let canvas = null
let mainImage = null
let originalWidth = 0
let originalHeight = 0
let displayScale = 1

const currentCropRatio = ref('free')
const watermarkText = ref('')
const brightness = ref(0)
const contrast = ref(0)
const borderRadius = ref(0)

const cropRatios = [
  { label: '自由', value: 'free' },
  { label: '1:1', value: '1:1' },
  { label: '4:3', value: '4:3' },
  { label: '16:9', value: '16:9' }
]

onMounted(() => {
  initCanvas()
})

onUnmounted(() => {
  if (canvas) {
    canvas.dispose()
  }
})

const initCanvas = () => {
  const containerWidth = 700
  const containerHeight = 600
  
  canvas = new fabric.Canvas(null, {
    width: containerWidth,
    height: containerHeight
  })
  canvas.setWidth(containerWidth)
  canvas.setHeight(containerHeight)
  
  const canvasElement = canvas.getElement()
  canvasElement.style.display = 'block'
  canvasContainer.value.appendChild(canvasElement)

  fabric.Image.fromURL(props.image.url, (img) => {
    originalWidth = img.width
    originalHeight = img.height
    const maxWidth = containerWidth - 40
    const maxHeight = containerHeight - 40
    displayScale = Math.min(maxWidth / img.width, maxHeight / img.height, 1)
    img.scale(displayScale)
    img.set({
      selectable: true
    })
    mainImage = img
    canvas.add(img)
    canvas.centerObject(img)
    canvas.renderAll()
  })
}

const setCropRatio = (ratio) => {
  currentCropRatio.value = ratio
}

const rotate = (degrees) => {
  if (mainImage) {
    mainImage.rotate(mainImage.angle + degrees)
    canvas.renderAll()
  }
}

const flip = (direction) => {
  if (mainImage) {
    if (direction === 'h') {
      mainImage.set('flipX', !mainImage.flipX)
    } else {
      mainImage.set('flipY', !mainImage.flipY)
    }
    canvas.renderAll()
  }
}

const addTextWatermark = () => {
  if (!watermarkText.value) return
  const text = new fabric.Text(watermarkText.value, {
    left: 100,
    top: 100,
    fontSize: 30,
    fill: 'rgba(0,0,0,0.5)',
    selectable: true
  })
  canvas.add(text)
  canvas.renderAll()
}

const handleWatermarkFile = (e) => {
  const file = e.target.files[0]
  if (!file) return
  const url = URL.createObjectURL(file)
  fabric.Image.fromURL(url, (img) => {
    img.scale(0.3)
    img.set({
      left: 100,
      top: 100,
      selectable: true,
      opacity: 0.5
    })
    canvas.add(img)
    canvas.renderAll()
  })
}

const applyFilters = () => {
  if (!mainImage) return
  mainImage.filters = []
  if (brightness.value !== 0) {
    mainImage.filters.push(new fabric.Image.filters.Brightness({ brightness: brightness.value / 100 }))
  }
  if (contrast.value !== 0) {
    mainImage.filters.push(new fabric.Image.filters.Contrast({ contrast: contrast.value / 100 }))
  }
  mainImage.applyFilters()
  canvas.renderAll()
}

const applyBorderRadius = () => {
  if (mainImage) {
    mainImage.set('rx', borderRadius.value)
    mainImage.set('ry', borderRadius.value)
    canvas.renderAll()
  }
}

const save = () => {
  if (!mainImage) {
    emit('close')
    return
  }
  
  const exportCanvas = document.createElement('canvas')
  exportCanvas.width = originalWidth
  exportCanvas.height = originalHeight
  const exportCtx = exportCanvas.getContext('2d')
  
  const exportScale = 1 / displayScale
  
  const objects = canvas.getObjects()
  
  objects.forEach(obj => {
    const scaledLeft = obj.left * exportScale
    const scaledTop = obj.top * exportScale
    
    exportCtx.save()
    exportCtx.translate(scaledLeft, scaledTop)
    exportCtx.rotate(obj.angle * Math.PI / 180)
    
    if (obj.flipX) exportCtx.scale(-1, 1)
    if (obj.flipY) exportCtx.scale(1, -1)
    
    if (obj.type === 'image') {
      const imgElement = obj._element
      if (imgElement) {
        const imgWidth = obj.width * obj.scaleX * exportScale
        const imgHeight = obj.height * obj.scaleY * exportScale
        if (obj === mainImage) {
          exportCtx.globalAlpha = obj.opacity || 1
          exportCtx.drawImage(imgElement, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight)
        } else {
          exportCtx.globalAlpha = obj.opacity || 1
          exportCtx.drawImage(imgElement, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight)
        }
      }
    } else if (obj.type === 'text' || obj.type === 'i-text' || obj.type === 'textbox') {
      const fontSize = (obj.fontSize || 30) * exportScale
      exportCtx.font = `${obj.fontWeight || 'normal'} ${fontSize}px ${obj.fontFamily || 'Arial'}`
      exportCtx.fillStyle = obj.fill || 'rgba(0,0,0,0.5)'
      exportCtx.textAlign = 'center'
      exportCtx.textBaseline = 'middle'
      exportCtx.fillText(obj.text, 0, 0)
    }
    
    exportCtx.restore()
  })
  
  const dataUrl = exportCanvas.toDataURL('image/png')
  emit('save', dataUrl)
}

const close = () => {
  emit('close')
}
</script>
