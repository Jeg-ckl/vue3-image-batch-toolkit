# 🖼️ Image Batch Toolkit - 图片批量处理工具箱

一个纯前端实现的图片批量处理工具箱，支持图片上传、批量压缩、旋转、格式转换、添加水印等功能，所有处理均在浏览器端完成，无需后端服务，保护您的隐私安全。

## 🚀 功能特性

### 1. 上传模块
- ✅ 点击或拖拽上传多张图片
- ✅ 支持 JPG、PNG、WebP 格式
- ✅ 实时预览缩略图
- ✅ 显示文件名、大小、尺寸

### 2. 批量处理模块
- ✅ 批量压缩（可自定义压缩质量）
- ✅ 批量旋转（90°/180°/270°）
- ✅ 批量添加文字水印
- ✅ 批量重命名
- ✅ 批量格式转换（JPG ↔ PNG ↔ WebP）

### 3. 单图精细编辑
- ✅ 自由裁剪（固定比例 1:1 / 4:3 / 16:9）
- ✅ 图片翻转（水平/垂直）
- ✅ 圆角调整
- ✅ 亮度对比度微调
- ✅ 文字/图片水印（支持拖拽）
- ✅ 基于 fabric.js 实现，支持图层编辑

### 4. 输出模块
- ✅ 单张下载
- ✅ 一键打包下载全部（使用 JSZip）
- ✅ 处理前后大小对比展示
- ✅ 仅下载已处理图片

## 🛠️ 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue 3 | ^3.4.21 | 前端框架 |
| Vite | ^5.1.6 | 构建工具 |
| Fabric.js | ^5.3.0 | 图片编辑（拖拽裁剪、旋转、图层） |
| JSZip | ^3.10.1 | 图片打包下载 |
| Tailwind CSS | ^3.4.1 | UI 样式框架 |
| Vitest | ^1.3.1 | 单元测试框架 |

## 📦 安装和运行

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

项目将在 `http://localhost:5173/` 启动。

### 3. 构建生产版本

```bash
npm run build
```

### 4. 预览生产构建

```bash
npm run preview
```

### 5. 运行测试

```bash
npm run test
```

## 📁 项目结构

```
vue3-image-batch-toolkit/
├── src/
│   ├── components/
│   │   ├── UploadBox.vue       # 拖拽上传组件
│   │   ├── ImageList.vue       # 图片列表预览组件
│   │   ├── ImageEditor.vue     # 单图编辑器（基于 fabric.js）
│   │   ├── BatchTool.vue       # 批量处理工具组件
│   │   └── DownloadPanel.vue   # 下载面板组件
│   ├── utils/
│   │   ├── imageProcessor.js   # 图片处理工具函数
│   │   ├── watermark.js        # 水印生成工具
│   │   ├── zip.js              # 打包下载工具
│   │   └── __tests__/          # 单元测试
│   │       └── imageProcessor.test.js
│   ├── views/
│   │   └── Index.vue           # 主页面
│   ├── App.vue
│   ├── main.js
│   └── style.css
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## 💡 使用说明

### 1. 上传图片
- 点击上传区域或直接拖拽图片到上传区域
- 支持一次上传多张图片
- 图片会在下方网格中显示

### 2. 选择图片
- 点击图片左上角的复选框选择需要处理的图片
- 可以选择多张图片进行批量处理

### 3. 批量处理
- 在左侧面板选择需要的处理操作
- 支持压缩、旋转、格式转换、重命名、添加水印
- 操作会应用到所有已选中的图片

### 4. 单图编辑
- 点击图片上的编辑按钮
- 在弹出的编辑器中进行精细编辑
- 支持裁剪、旋转、翻转、调整亮度对比度、添加水印等

### 5. 下载图片
- 在左侧下载面板查看处理统计
- 可以一键打包下载全部图片
- 也可以选择仅下载已处理的图片

## 🔧 核心 API 说明

### imageProcessor.js
- `formatFileSize(bytes)`: 格式化文件大小
- `getImageDimensions(file)`: 获取图片尺寸
- `compressImage(file, quality)`: 压缩图片
- `rotateImage(file, degrees)`: 旋转图片
- `convertImageFormat(file, format)`: 转换图片格式
- `fileToBase64(file)`: 文件转 Base64

### watermark.js
- `addTextWatermark(file, text, options)`: 添加文字水印
- `addImageWatermark(file, watermarkFile, options)`: 添加图片水印

### zip.js
- `downloadFilesAsZip(files, zipName)`: 打包下载文件
- `downloadSingleFile(file)`: 下载单个文件

## 📝 注意事项

- 所有处理均在浏览器端完成，图片不会上传到任何服务器
- 大图片处理可能会占用较多内存，请合理控制同时处理的图片数量
- 建议使用现代浏览器（Chrome、Firefox、Edge 等）以获得最佳体验

## 📄 许可证

MIT License

## 👨‍💻 作者

本项目使用 Vue 3 + Vite 构建，适合作为面试作品或学习参考。
