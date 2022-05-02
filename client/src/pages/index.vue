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
interface State {
  file: File | null
  hash: string | null
  chunks: any[]
  fileList: any[]
}

const state: State = reactive({
  file: null,
  hash: null,
  chunks: [],
  fileList: []
})

interface Event<T = EventTarget> {
  target: T
}

const handleFileChange = (event: Event<HTMLInputElement>) => {
  const file = event.target.files![0]
  if (!file) { return }
  state.file = file
}

const handleUpload = () => {
  console.log('upader', state.file)
}
</script>
