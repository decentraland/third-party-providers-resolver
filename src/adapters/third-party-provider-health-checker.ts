import { IBaseComponent } from '@well-known-components/interfaces'
import parse from '../logic/third-party-url-parser'
import { AppComponents, ThirdPartyProvider } from '../types'

export type ThirdPartyProviderHealthChecker = IBaseComponent & {
  isHealthy(thirdPartyProvider: ThirdPartyProvider): Promise<boolean>
}

function isThirdPartyProviderDisabled(error: any): boolean {
  return !!error && error.errno === 'ENOTFOUND'
}

export function createThirdPartyProviderHealthComponent({
  fetch,
  logs,
  metrics
}: Pick<AppComponents, 'fetch' | 'logs' | 'metrics'>): ThirdPartyProviderHealthChecker {
  const logger = logs.getLogger('third-party-provider-health-checker')

  return {
    async isHealthy(thirdPartyProvider: ThirdPartyProvider): Promise<boolean> {
      const thirdPartyUrl: string = await parse(thirdPartyProvider)

      try {
        await fetch.fetch(thirdPartyUrl)

        // report provider as healthy
        metrics.observe('third_party_provider_health', { provider: thirdPartyProvider.id }, 1)
        return true
      } catch (err: any) {
        logger.warn('The following Third Party Provider is unhealthy.', {
          thirdPartyProvider: thirdPartyProvider.id,
          thirdPartyUrl
        })

        // report provider as unhealthy
        metrics.observe('third_party_provider_health', { provider: thirdPartyProvider.id }, 0)
        if (isThirdPartyProviderDisabled(err)) {
          logger.error('Domain was not resolved')
        }

        return false
      }
    }
  }
}
