<template>
  <div class="image-list">
    <div v-if="images.length === 0" class="text-center py-12 text-gray-500">
      暂无图片，请先上传
    </div>
    <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div
        v-for="img in images"
        :key="img.id"
        class="image-item bg-white rounded-lg shadow-md overflow-hidden relative group"
      >
        <div class="aspect-square overflow-hidden">
          <img :src="img.processed?.url || img.url" :alt="img.name" class="w-full h-full object-cover" />
        </div>
        <div class="p-3">
          <p class="text-sm font-medium text-gray-800 truncate">{{ img.name }}</p>
          <p class="text-xs text-gray-500 mt-1">{{ formatFileSize(img.size) }} · {{ img.width }}×{{ img.height }}</p>
          <div v-if="img.processed" :class="['text-xs mt-1', img.size > img.processed.size ? 'text-green-600' : 'text-orange-600']">
            已处理 ({{ img.size > img.processed.size ? '节约' : '增大' }}: {{ formatFileSize(Math.abs(img.size - img.processed.size)) }})
          </div>
        </div>
        <div class="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button @click="$emit('edit', img)" class="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">
            ✏️
          </button>
          <button @click="$emit('remove', img.id)" class="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600">
            🗑️
          </button>
        </div>
        <div class="absolute top-2 left-2">
          <input type="checkbox" v-model="selectedIds" :value="img.id" class="w-5 h-5" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { formatFileSize } from '../utils/imageProcessor'

const props = defineProps({
  images: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['edit', 'remove', 'selection-change'])

const selectedIds = ref([])

const selectedImages = computed(() => {
  return props.images.filter(img => selectedIds.value.includes(img.id))
})

watch(selectedIds, (newVal) => {
  emit('selection-change', selectedImages.value)
}, { deep: true })
</script>
