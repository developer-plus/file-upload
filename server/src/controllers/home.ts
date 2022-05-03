import type { Context } from 'koa'

class HomeController {
  async test(ctx: Context) {
    ctx.body = 'Hello World!'
  }
}

export default new HomeController()
