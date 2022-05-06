import service from '~/utils/request'

enum API {
  CHECK = '/check',
  UPLOAD = '/upload'
}

export function file() {
  return service({
    url: '/file',
    method: 'get'
  })
}

interface Check {
  ext: string
  hash: string
}

export function check(data: Check) {
  return service({
    url: API.CHECK,
    method: 'post',
    data
  })
}

interface Upload {
  from: FormDataEventInit
}

export function upload(data: Upload, { onUploadProgress }: any) {
  return service({
    url: API.UPLOAD,
    method: 'post',
    data,
    onUploadProgress
  })
}

interface Merge {
  filename: string
  hash: string
}

export function merge(data: Merge) {
  return service({
    url: '/merge',
    method: 'post',
    data
  })
}
