import sparkMD5 from 'spark-md5'

const calculateHashSample = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const spark = new sparkMD5.ArrayBuffer()
    const reader = new FileReader()

    // 文件大小
    const size = file.size
    // 2MB
    const offset = 2 * 1024 * 1024

    const chunks = [file.slice(0, offset)]

    let cur = offset
    while (cur < size) {
      // 最后一块全部加进来
      if (cur + offset >= size) {
        chunks.push(file.slice(cur, cur + offset))
      }
      else {
        // 中间的：前中后取两个字节
        const mid = cur + offset / 2
        const end = cur + offset
        chunks.push(file.slice(cur, cur + 2))
        chunks.push(file.slice(mid, mid + 2))
        chunks.push(file.slice(end - 2, end))
      }
      cur += offset
    }

    reader.readAsArrayBuffer(new Blob(chunks))
    reader.onload = (e) => {
      spark.append(e.target!.result as ArrayBuffer)
      resolve(spark.end())
    }

    reader.onerror = err => reject(err)
  })
}

export {
  calculateHashSample
}
