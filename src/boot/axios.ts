import { defineBoot } from '#q-app/wrappers'
import axios, { type AxiosInstance } from 'axios'

declare module 'vue' {
  // noinspection JSUnusedGlobalSymbols
  interface ComponentCustomProperties {
    $rawModelApi: AxiosInstance
  }
}

export const rawModelApi = axios.create({ baseURL: 'http://10.113.36.113:9190' })

export default defineBoot(({ app }) => {
  app.config.globalProperties.$rawModelApi = rawModelApi
})
