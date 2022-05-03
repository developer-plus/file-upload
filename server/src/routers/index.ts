import KoaRouter from 'koa-router'
import HomeController from '../controllers/home'

const router = new KoaRouter()

router.post('/check', HomeController.check)

export default router
