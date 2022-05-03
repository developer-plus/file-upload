import 'reflect-metadata'
import KoaRouter from 'koa-router'
import type { Methods } from './request'

const router = new KoaRouter()

const CONTROLLER = (prefix = '/') => {
  return (target: new (...args: any) => any) => {
    for (const key in target.prototype) {
      const path: string = Reflect.getMetadata('path', target.prototype, key)
      const method: Methods = Reflect.getMetadata('method', target.prototype, key)
      const handler: any = target.prototype[key]
      const middlewares: any[] = Reflect.getMetadata('middlewares', target.prototype, key) || []
      if (path && method) {
        const prefixCoverPath = prefix === '/' ? path : `${prefix}${path}`
        if (middlewares.length) {
          router[method](prefixCoverPath, ...middlewares, handler.bind(target.prototype))
        }
        else {
          router[method](prefixCoverPath, handler.bind(target.prototype))
        }
      }
    }
  }
}

export {
  CONTROLLER,
  router
}
