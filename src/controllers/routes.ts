import { Router } from '@well-known-components/http-server'
import { GlobalContext } from '../types'
import { getProvidersHandler } from './handlers/get-providers-handler'

// We return the entire router because it will be easier to test than a whole server
export async function setupRouter(_: GlobalContext): Promise<Router<GlobalContext>> {
  const router = new Router<GlobalContext>()

  router.get('/providers', getProvidersHandler)

  return router
}
