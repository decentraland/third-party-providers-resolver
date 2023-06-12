import { LRUCache } from 'lru-cache'
import { AppComponents, ThirdPartyProvider } from '../types'
import { IBaseComponent } from '@well-known-components/interfaces'
import cron, { ScheduledTask } from 'node-cron'

export type ThirdPartyProvidersMemoryStorage = IBaseComponent & {
  get(refreshData?: boolean): Promise<ThirdPartyProvider[]>
}

export function createThirdPartyProvidersMemoryStorage({
  thirdPartyProvidersFetcher,
  thirdPartyProviderHealthChecker
}: Pick<
  AppComponents,
  'thirdPartyProvidersFetcher' | 'thirdPartyProviderHealthChecker'
>): ThirdPartyProvidersMemoryStorage {
  const jobSchedule = '0 */3 * * *' // every 3 hours
  let job: ScheduledTask
  const cache = new LRUCache<number, ThirdPartyProvider[]>({
    max: 1,
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
    async get(refreshData?: boolean): Promise<ThirdPartyProvider[]> {
      const thirdPartyProviders = await cache.fetch(0, { forceRefresh: !!refreshData })
      if (thirdPartyProviders) return thirdPartyProviders

      throw new Error('Could not fetch Third Party providers')
    },
    async start(): Promise<void> {
      await this.get()
      job = cron.schedule(jobSchedule, async () => {
        await this.get(true)
      })
      job.start()
    },
    async stop(): Promise<void> {
      job?.stop()
    }
  }
}
