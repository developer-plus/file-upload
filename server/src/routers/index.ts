import KoaRouter from 'koa-router'
import HomeController from '../controllers/home'

const router = new KoaRouter()

router.get('/', HomeController.test)

export default router
