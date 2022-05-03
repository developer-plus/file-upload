import type { Context } from 'koa'

class HomeController {
  async check(ctx: Context) {
    ctx.body = {
      uploaded: true,
      uploadedList: []
    }
  }
}

export default new HomeController()
