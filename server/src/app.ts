import Koa from 'koa'
import serve from 'koa-static'
import router from './routers'
import defaultConfig from './configs'

const { port, staticDir } = defaultConfig

const app = new Koa()

app.use(serve(staticDir))
app.use(router.routes())

app.listen(port, () => {
  console.log(`Server is running on port ${port}...`)
})
