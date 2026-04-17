<template>
  <div class="batch-tool bg-white rounded-xl shadow-lg p-6">
    <h2 class="text-xl font-bold mb-4">批量处理工具</h2>

    <div class="space-y-6">
      <div class="border-b pb-4">
        <h3 class="font-semibold mb-3">批量压缩</h3>
        <div class="flex items-center gap-4">
          <div class="flex-1">
            <label class="block text-sm text-gray-600 mb-1">压缩质量: {{ Math.round(compressionQuality * 100) }}%</label>
            <input v-model.number="compressionQuality" type="range" min="0.1" max="1" step="0.1" class="w-full" />
          </div>
          <button @click="batchCompress" :disabled="selectedImages.length === 0"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50">
            压缩选中 ({{ selectedImages.length }})
          </button>
        </div>
      </div>

      <div class="border-b pb-4">
        <h3 class="font-semibold mb-3">批量旋转</h3>
        <div class="flex gap-2">
          <button v-for="deg in [90, 180, 270]" :key="deg" @click="batchRotate(deg)"
            :disabled="selectedImages.length === 0"
            class="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50">
            {{ deg }}°
          </button>
        </div>
      </div>

      <div class="border-b pb-4">
        <h3 class="font-semibold mb-3">批量格式转换</h3>
        <div class="flex items-center gap-4">
          <select v-model="targetFormat" class="px-4 py-2 border rounded-lg">
            <option value="jpg">JPG</option>
            <option value="png">PNG</option>
            <option value="webp">WebP</option>
          </select>
          <button @click="batchConvertFormat" :disabled="selectedImages.length === 0"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50">
            转换格式
          </button>
        </div>
      </div>

      <div class="border-b pb-4">
        <h3 class="font-semibold mb-3">批量重命名</h3>
        <div class="flex items-center gap-4">
          <input v-model="renamePrefix" type="text" placeholder="前缀 (如: image_)" class="px-4 py-2 border rounded-lg flex-1" />
          <button @click="batchRename" :disabled="selectedImages.length === 0"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50">
            重命名
          </button>
        </div>
      </div>

      <div class="pb-4">
        <h3 class="font-semibold mb-3">批量文字水印</h3>
        <div class="flex items-center gap-4">
          <input v-model="watermarkText" type="text" placeholder="水印文字" class="px-4 py-2 border rounded-lg flex-1" />
          <button @click="batchAddTextWatermark" :disabled="selectedImages.length === 0 || !watermarkText"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50">
            添加水印
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { compressImage, rotateImage, convertImageFormat, getImageDimensions } from '../utils/imageProcessor'
import { addTextWatermark } from '../utils/watermark'

const props = defineProps({
  selectedImages: {
    type: Array,
    default: () => []
  },
  allImages: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update'])

const compressionQuality = ref(0.8)
const targetFormat = ref('jpg')
const renamePrefix = ref('image_')
const watermarkText = ref('')

const batchCompress = async () => {
  for (const img of props.selectedImages) {
    const compressedFile = await compressImage(img.processed?.file || img.file, compressionQuality.value)
    const dimensions = await getImageDimensions(compressedFile)
    img.processed = {
      file: compressedFile,
      url: URL.createObjectURL(compressedFile),
      size: compressedFile.size,
      width: dimensions.width,
      height: dimensions.height
    }
  }
  emit('update')
}

const batchRotate = async (degrees) => {
  for (const img of props.selectedImages) {
    const rotatedFile = await rotateImage(img.processed?.file || img.file, degrees)
    const dimensions = await getImageDimensions(rotatedFile)
    img.processed = {
      file: rotatedFile,
      url: URL.createObjectURL(rotatedFile),
      size: rotatedFile.size,
      width: dimensions.width,
      height: dimensions.height
    }
  }
  emit('update')
}

const batchConvertFormat = async () => {
  for (const img of props.selectedImages) {
    const convertedFile = await convertImageFormat(img.processed?.file || img.file, targetFormat.value)
    const dimensions = await getImageDimensions(convertedFile)
    img.processed = {
      file: convertedFile,
      url: URL.createObjectURL(convertedFile),
      size: convertedFile.size,
      width: dimensions.width,
      height: dimensions.height
    }
    img.name = convertedFile.name
  }
  emit('update')
}

const batchRename = () => {
  props.selectedImages.forEach((img, index) => {
    const ext = img.name.split('.').pop()
    img.name = `${renamePrefix.value}${index + 1}.${ext}`
    if (img.processed) {
      const newFile = new File([img.processed.file], img.name, { type: img.processed.file.type })
      img.processed.file = newFile
    }
  })
  emit('update')
}

const batchAddTextWatermark = async () => {
  for (const img of props.selectedImages) {
    const watermarkedFile = await addTextWatermark(img.processed?.file || img.file, watermarkText.value, {
      fontSize: 48,
      color: 'rgba(0, 0, 0, 0.3)',
      x: 50,
      y: 100
    })
    const dimensions = await getImageDimensions(watermarkedFile)
    img.processed = {
      file: watermarkedFile,
      url: URL.createObjectURL(watermarkedFile),
      size: watermarkedFile.size,
      width: dimensions.width,
      height: dimensions.height
    }
  }
  emit('update')
}
</script>
