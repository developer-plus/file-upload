import sparkMD5 from 'spark-md5'
import { CHUNK_SIZE } from '~/constants'

export const ext = (filename: string) => {
  return filename.split('.').pop() || ''
}

export const createFileChunk = (file: File, size = CHUNK_SIZE) => {
  // 生成文件块 Blob.slice 语法
  const chunks = []
  let cur = 0
  while (cur < file.size) {
    chunks.push({ index: cur, file: file.slice(cur, cur + size) })
    cur += size
  }
  return chunks
}

// 文件抽样哈希计算
export const calculateHashSample = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    // 文件大小
    const size = file.size
    // 2MB
    const offset = 2 * 1024 * 1024

    // 前 2MB 全部加进来
    const chunks = [file.slice(0, offset)]

    let cur = offset
    while (cur < size) {
      // 如果最后一块小于 2MB 则全部加进来
      if (cur + offset >= size) {
        chunks.push(file.slice(cur))
      }
      else {
        // 中间部分，每一片取前中后两个字节
        // 0123456789 -> 014589
        const mid = cur + offset / 2
        const end = cur + offset
        chunks.push(file.slice(cur, cur + 2))
        chunks.push(file.slice(mid - 1, mid + 1))
        chunks.push(file.slice(end - 2, end))
      }
      cur += offset
    }

    const reader = new FileReader()
    const spark = new sparkMD5.ArrayBuffer()
    reader.readAsArrayBuffer(new Blob(chunks))
    reader.onload = (e) => {
      // 通过 spark-md5 计算 hash
      spark.append(e.target!.result as ArrayBuffer)
      resolve(spark.end())
    }

    reader.onerror = err => reject(err)
  })
}
