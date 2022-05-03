import service from '~/utils/request'

enum API {
  CHECK = '/check',
  UPLOAD = '/upload'
}

interface CheckData {
  ext: string
  hash: string
}

export function check(data: CheckData) {
  return service({
    url: API.CHECK,
    method: 'post',
    data
  })
}

interface UploadData {
  from: FormDataEventInit
}

export function upload(data: UploadData, { onUploadProgress }: any) {
  return service({
    url: API.UPLOAD,
    method: 'post',
    data,
    onUploadProgress
  })
}
