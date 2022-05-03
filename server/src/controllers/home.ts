import path from 'path'
import fse from 'fs-extra'
import type { Context } from 'koa'
import { staticDir } from '../configs'
import { CONTROLLER, POST } from '../decorator'

@CONTROLLER()
class HomeController {
  async getUploadList(dirPath: string) {
    // 过滤诡异文件的隐藏文件，比如 .DS_Store
    return fse.existsSync(dirPath) ? (await fse.readdir(dirPath)).filter(name => name[0] !== '.') : []
  }

  @POST('/check')
  async check(ctx: Context) {
    const { ext, hash } = ctx.request.body
    const filePath = path.resolve(staticDir, `${hash}.${ext}`)

    let uploaded = false
    let uploadedList: any[] = []
    if (fse.existsSync(filePath)) {
      uploaded = true
    }
    else {
      // 文件没有完全上传完毕，但是可能存在的部分切片上传完毕了
      uploadedList = await this.getUploadList(path.resolve(staticDir, hash))
    }
    ctx.body = {
      uploaded,
      uploadedList
    }
  }

  @POST('/upload')
  async upload(ctx: Context) {
    console.log(ctx.request)
  }
}

export {
  HomeController
}
