<template>
  <div class="download-panel bg-white rounded-xl shadow-lg p-6">
    <h2 class="text-xl font-bold mb-4">下载面板</h2>

    <div v-if="images.length === 0" class="text-gray-500 text-center py-4">
      暂无可下载的图片
    </div>

    <div v-else class="space-y-4">
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div class="bg-gray-50 p-3 rounded-lg">
          <p class="text-gray-500">总图片数</p>
          <p class="text-2xl font-bold">{{ images.length }}</p>
        </div>
        <div class="bg-gray-50 p-3 rounded-lg">
          <p class="text-gray-500">已处理</p>
          <p class="text-2xl font-bold">{{ processedCount }}</p>
        </div>
      </div>

      <div v-if="totalOriginalSize > 0" class="bg-blue-50 p-4 rounded-lg">
        <div class="flex justify-between text-sm mb-2">
          <span>原始大小</span>
          <span class="font-medium">{{ formatFileSize(totalOriginalSize) }}</span>
        </div>
        <div class="flex justify-between text-sm mb-2">
          <span>处理后大小</span>
          <span class="font-medium">{{ formatFileSize(totalProcessedSize) }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span>{{ totalOriginalSize > totalProcessedSize ? '节约空间' : '空间增大' }}</span>
          <span :class="['font-medium', totalOriginalSize > totalProcessedSize ? 'text-green-600' : 'text-orange-600']">
            {{ formatFileSize(Math.abs(totalOriginalSize - totalProcessedSize)) }} ({{ savedPercent }}%)
          </span>
        </div>
      </div>

      <div class="space-y-2">
        <button @click="downloadAll" :disabled="images.length === 0"
          class="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 font-medium">
          📦 一键打包下载全部 ({{ images.length }}张)
        </button>
        <button v-if="processedCount > 0" @click="downloadProcessed"
          class="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium">
          📥 仅下载已处理 ({{ processedCount }}张)
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatFileSize } from '../utils/imageProcessor'
import { downloadFilesAsZip, downloadSingleFile } from '../utils/zip'

const props = defineProps({
  images: {
    type: Array,
    default: () => []
  }
})

const processedCount = computed(() => {
  return props.images.filter(img => img.processed).length
})

const totalOriginalSize = computed(() => {
  return props.images.reduce((sum, img) => sum + img.size, 0)
})

const totalProcessedSize = computed(() => {
  return props.images.reduce((sum, img) => sum + (img.processed?.size || img.size), 0)
})

const savedPercent = computed(() => {
  if (totalOriginalSize.value === 0) return 0
  return Math.round(((totalOriginalSize.value - totalProcessedSize.value) / totalOriginalSize.value) * 100)
})

const downloadAll = () => {
  const files = props.images.map(img => img.processed?.file || img.file)
  downloadFilesAsZip(files, 'images_batch.zip')
}

const downloadProcessed = () => {
  const files = props.images.filter(img => img.processed).map(img => img.processed.file)
  if (files.length > 0) {
    downloadFilesAsZip(files, 'processed_images.zip')
  }
}
</script>
