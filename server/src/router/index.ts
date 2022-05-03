import KoaRouter from 'koa-router'

const router = new KoaRouter()

router.get('/', async(ctx, next) => {
  ctx.body = 'Hello Hongbusi'
})

export default router
