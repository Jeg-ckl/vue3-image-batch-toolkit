<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <h1 class="text-2xl font-bold text-gray-800">
          🖼️ Image Batch Toolkit - 图片批量处理工具箱
        </h1>
        <p class="text-gray-500 text-sm mt-1">纯前端处理，保护您的隐私安全</p>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 py-8">
      <div v-if="images.length === 0" class="mb-8">
        <UploadBox @upload="handleUpload" />
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div class="lg:col-span-1 space-y-6">
          <div class="bg-white rounded-xl shadow-lg p-4">
            <button @click="showUpload = !showUpload" class="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              + 继续添加图片
            </button>
            <button v-if="images.length > 0" @click="clearAll" class="w-full py-2 mt-2 border border-red-300 text-red-500 rounded-lg hover:bg-red-50">
              清空全部
            </button>
          </div>
          <BatchTool
            :selected-images="selectedImages"
            :all-images="images"
            @update="refresh"
          />
          <DownloadPanel :images="images" />
        </div>

        <div class="lg:col-span-3">
          <div v-if="showUpload" class="mb-6">
            <UploadBox @upload="handleUpload" />
          </div>
          <ImageList
            :images="images"
            @edit="openEditor"
            @remove="removeImage"
            @selection-change="handleSelectionChange"
          />
        </div>
      </div>

      <ImageEditor
        v-if="showEditor && currentEditImage"
        :image="currentEditImage"
        @close="showEditor = false"
        @save="handleEditorSave"
      />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import UploadBox from '../components/UploadBox.vue'
import ImageList from '../components/ImageList.vue'
import ImageEditor from '../components/ImageEditor.vue'
import BatchTool from '../components/BatchTool.vue'
import DownloadPanel from '../components/DownloadPanel.vue'
import { getImageDimensions } from '../utils/imageProcessor'

const images = ref([])
const selectedImages = ref([])
const showUpload = ref(false)
const showEditor = ref(false)
const currentEditImage = ref(null)

const handleUpload = (newImages) => {
  images.value = [...images.value, ...newImages]
  showUpload.value = false
}

const removeImage = (id) => {
  images.value = images.value.filter(img => img.id !== id)
}

const clearAll = () => {
  if (confirm('确定要清空所有图片吗？')) {
    images.value = []
    selectedImages.value = []
  }
}

const handleSelectionChange = (selected) => {
  selectedImages.value = selected
}

const openEditor = (img) => {
  currentEditImage.value = img
  showEditor.value = true
}

const handleEditorSave = async (dataUrl) => {
  if (!dataUrl || !dataUrl.startsWith('data:')) {
    showEditor.value = false
    return
  }
  
  try {
    const response = await fetch(dataUrl)
    const blob = await response.blob()
    
    if (!blob || blob.size === 0) {
      showEditor.value = false
      return
    }
    
    const file = new File([blob], currentEditImage.value.name.replace(/\.[^/.]+$/, '.png'), { type: 'image/png' })
    const dimensions = await getImageDimensions(file)
    
    const img = images.value.find(i => i.id === currentEditImage.value.id)
    if (img) {
      img.processed = {
        file,
        url: dataUrl,
        size: file.size,
        width: dimensions.width,
        height: dimensions.height
      }
    }
  } catch (error) {
    console.error('Failed to save edited image:', error)
  }
  showEditor.value = false
}

const refresh = () => {
  images.value = [...images.value]
}
</script>
