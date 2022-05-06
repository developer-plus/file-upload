<template>
  <main class="container mx-auto">
    <div class="flex">
      <div class="flex-1 p-2">
        <h2 class="text-xl">
          文件列表
        </h2>
        <div class="mt-4 min-h-70vh border border-gray-200">
          <div v-if="!fileList.length" class="mt-5 text-gray">
            暂无数据
          </div>
          <div v-else>
            <div v-for="(file, index) in fileList" :key="index">
              {{ file }}
            </div>
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
import { ext, createFileChunk, calculateHashSample } from '~/utils'
import { getFileList, check, upload, merge } from '~/api'
import { CHUNK_SIZE } from '~/constants'
import type { Chunks } from '~/types'

// 获取已上传文件列表
const fileList = ref([])
onMounted(async() => {
  const { data } = await getFileList()
  fileList.value = data
})

const file = ref<File | null>(null)
// 文件扩展名
let extension = ''
const hash = ref('')
const chunks = ref<Chunks>([])

// 选择文件
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const targetFile = target.files![0]
  if (!targetFile) return
  file.value = targetFile
  extension = ext(targetFile.name)
}

const sendRequest = (chunks: any[], limit = 4) => {
  return new Promise((resolve, reject) => {
    const length = chunks.length
    let counter = 0
    let isStop = false

    const start = async() => {
      if (isStop) {
        return
      }

      const task = chunks.shift()

      if (task) {
        const { form, index } = task

        try {
          await upload(form, {
            onUploadProgress: (progress: any) => {
              // todo progress 处理
            }
          })

          if (counter === length - 1) {
            resolve('success')
          }
          else {
            counter++
            start()
          }
        }
        catch (error) {
          // 当前切片报错了
          // 尝试 3 次重试机制，重新 push 到数组中
          console.log('出错了')
          if (task.error < 3) {
            task.error++
            // 队首进去，准备重试
            chunks.unshift(task)
            start()
          }
          else {
            // 错误 3 次了，直接结束
            isStop = true
            reject(error)
          }
        }
      }
    }

    while (limit > 0) {
      setTimeout(() => {
        // 模拟延迟
        start()
      }, Math.random() * 2000)

      limit -= 1
    }
  })
}

const mergeRequest = async(filename: string, hash: string) => {
  await merge({
    ext: ext(filename),
    size: CHUNK_SIZE,
    hash
  })
}

// 上传切片
const uploadChunks = async(chunks: Chunks, uploadedList: string[] = [], fileHash) => {
  const file = unref(targetFile.value)

  const list = chunks
    .filter(chunk => uploadedList.indexOf(chunk.name) === -1)
    .map(({ chunk, name, hash, index }) => {
      const form = new FormData()
      form.append('chunkname', name)
      form.append('ext', ext(file!.name))
      form.append('hash', hash)
      form.append('file', chunk)
      return { form, index, error: 0 }
    })

  try {
    await sendRequest([...list], 4)
    if (uploadedList.length + list.length === chunks.length) {
      await mergeRequest(file.name, fileHash)
      alert('上传成功！')
      fetchFileList()
    }
  }
  catch (error) {
    // todo：优化 alert
    alert('上传似乎出了点问题～')
  }
}

const handleUpload = async() => {
  if (!file.value) {
    // todo：优化 alert
    alert('请选择文件')
    return
  }

  // 文件判重
  // 方案 1：计算 hash 文件指纹标识
  // 方案 2：web-worker 防止卡顿主线程
  // 方案 3：抽样哈希，牺牲一定的准确率换来效率，hash 一样的不一定是同一个文件，但是不一样的一定不是

  // 这里采用方案 3
  hash.value = await calculateHashSample(file.value)

  // todo：axios 封装，解决类型错误问题
  const { uploaded, uploadedList } = await check({
    ext: extension,
    hash: hash.value
  })

  if (uploaded) {
    // todo：优化 alert
    alert('已存在，无需再次上传！')
    return
  }

  const chunks = createFileChunk(file.value)

  const newChunks: Chunks = chunks.map((chunk, index) => {
    // 每一个切片的名字
    const chunkName = `${hash}-${index}`
    return {
      hash,
      chunk: chunk.file,
      name: chunkName,
      index,
      // 设置进度条
      progress: uploadedList.indexOf(chunkName) > -1 ? 100 : 0
    }
  })

  await uploadChunks(newChunks, uploadedList, hash)
}
</script>
