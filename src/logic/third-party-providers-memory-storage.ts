import { LRUCache } from 'lru-cache'
import { AppComponents, ThirdPartyProvider } from '../types'
import { IBaseComponent } from '@well-known-components/interfaces'

export type ThirdPartyProvidersMemoryStorage = IBaseComponent & {
  get(): Promise<ThirdPartyProvider[]>
}

export function createThirdPartyProvidersMemoryStorage({
  thirdPartyProvidersFetcher,
  thirdPartyProviderHealthChecker
}: Pick<
  AppComponents,
  'thirdPartyProvidersFetcher' | 'thirdPartyProviderHealthChecker'
>): ThirdPartyProvidersMemoryStorage {
  const cache = new LRUCache<number, ThirdPartyProvider[]>({
    max: 16,
    ttl: 1000 * 60 * 60 * 6, // 6 hours
    fetchMethod: async function (_: number, staleValue: ThirdPartyProvider[] | undefined) {
      const thirdPartyProviders: ThirdPartyProvider[] = await thirdPartyProvidersFetcher.getAll()

      const healthyThirdPartyProviders = await thirdPartyProviders.reduce(
        async (healthyProviders, thirdPartyProvider) => {
          const isThirdPartyProviderHealthy = await thirdPartyProviderHealthChecker.isHealthy(thirdPartyProvider)

          if (isThirdPartyProviderHealthy) {
            ;(await healthyProviders).push(thirdPartyProvider)
          }

          return healthyProviders
        },
        Promise.resolve([] as ThirdPartyProvider[])
      )

      return !!healthyThirdPartyProviders.length ? healthyThirdPartyProviders : staleValue
    }
  })

  return {
    async get(): Promise<ThirdPartyProvider[]> {
      const thirdPartyProviders = await cache.fetch(0)
      if (thirdPartyProviders) return thirdPartyProviders

      throw new Error('Could not fetch Third Party providers')
    },
    async start(): Promise<void> {
      await this.get()
    }
  }
}
