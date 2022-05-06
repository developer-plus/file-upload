import type { ViteSSGContext } from 'vite-ssg'

export type UserModule = (ctx: ViteSSGContext) => void

export interface Chunk {
  hash: string
  chunk: Blob
  name: string
  index: number
  progress: number
}

export type Chunks = Chunk[]
