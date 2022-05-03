import Koa from 'koa'
import serve from 'koa-static'
import defaultConfig from './config'

const { port, staticDir } = defaultConfig

const app = new Koa()

app.use(serve(staticDir))

app.listen(port, () => {
  console.log(`Server is running on port ${port}...`)
})
