<template>
  <div
    class="upload-box border-4 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300"
    :class="isDragover ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'"
    @dragover.prevent="isDragover = true"
    @dragleave.prevent="isDragover = false"
    @drop.prevent="handleDrop"
    @click="triggerInput"
  >
    <input
      ref="fileInput"
      type="file"
      multiple
      accept="image/jpeg,image/png,image/webp"
      @change="handleFileSelect"
      class="hidden"
    />
    <div class="text-6xl mb-4">🖼️</div>
    <h3 class="text-xl font-semibold text-gray-700 mb-2">点击或拖拽上传图片</h3>
    <p class="text-gray-500">支持 JPG、PNG、WebP 格式</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getImageDimensions } from '../utils/imageProcessor'

const emit = defineEmits(['upload'])
const fileInput = ref(null)
const isDragover = ref(false)

const triggerInput = () => {
  fileInput.value.click()
}

const processFiles = async (files) => {
  const validFiles = []
  for (const file of Array.from(files)) {
    if (['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      const dimensions = await getImageDimensions(file)
      validFiles.push({
        file,
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        width: dimensions.width,
        height: dimensions.height,
        url: URL.createObjectURL(file),
        processed: null
      })
    }
  }
  if (validFiles.length > 0) {
    emit('upload', validFiles)
  }
}

const handleFileSelect = (e) => {
  processFiles(e.target.files)
  e.target.value = ''
}

const handleDrop = (e) => {
  isDragover.value = false
  processFiles(e.dataTransfer.files)
}
</script>
