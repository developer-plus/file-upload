import service from '~/utils/request'

export function check(data: any) {
  return service({
    url: '/check',
    method: 'post',
    data
  })
}
