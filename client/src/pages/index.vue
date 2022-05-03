<template>
  <main class="container mx-auto">
    <div class="flex">
      <div class="flex-1 p-2">
        <h2 class="text-xl">
          文件列表
        </h2>
        <div class="mt-4 min-h-70vh border border-gray-200">
          <div class="mt-5 text-gray">
            暂无数据
          </div>
        </div>
      </div>
      <div class="flex-1 p-2">
        <h2 class="text-xl">
          文件上传
        </h2>
        <div class="flex justify-center items-center mt-4 min-h-70vh border border-gray-200">
          <input type="file" name="file" @change="handleFileChange">

          <button class="btn" @click="handleUpload">
            开始上传
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ext } from '~/utils'
import { calculateHashSample } from '~/utils/calculateHash'
import { check } from '~/api'

const file = ref<File | null>(null)

// 选择文件
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const targetFile = target.files![0]
  if (!targetFile) { return }
  file.value = targetFile
}

const handleUpload = async() => {
  if (!file.value) {
    // todo：弹窗提示，请选择文件
    return
  }

  // 文件判重
  // 方案 1：计算 hash 文件指纹标识
  // 方案 2：web-worker 防止卡顿主线程
  // 方案 3：抽样哈希，牺牲一定的准确率换来效率，hash 一样的不一定是同一个文件，但是不一样的一定不是

  // 这里采用方案 3
  const hash = await calculateHashSample(file.value)

  const { uploaded, uploadedList } = await check({
    ext: ext(file.value.name),
    hash
  })
}
</script>
