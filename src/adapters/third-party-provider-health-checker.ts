import { IBaseComponent } from '@well-known-components/interfaces'
import parse from '../logic/third-party-url-parser'
import { AppComponents, ThirdPartyProvider } from '../types'

export type ThirdPartyProviderHealthChecker = IBaseComponent & {
  isHealthy(thirdPartyProvider: ThirdPartyProvider): Promise<boolean>
}

enum HealthState {
  Healthy = 1,
  Unhealthy = 2,
  Inexistent = 3
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
      const thirdPartyProviderMetricLabels = {
        providerId: thirdPartyProvider.id,
        providerName: thirdPartyProvider.metadata.thirdParty.name
      }

      try {
        await fetch.fetch(thirdPartyUrl)

        // report provider as healthy
        metrics.observe('third_party_provider_health', thirdPartyProviderMetricLabels, HealthState.Healthy)
        return true
      } catch (err: any) {
        let unhealthyProviderState: HealthState
        logger.warn('The following Third Party Provider is unhealthy.', {
          thirdPartyProvider: thirdPartyProvider.id,
          thirdPartyUrl
        })

        if (isThirdPartyProviderDisabled(err)) {
          logger.warn('Domain was not resolved')
          unhealthyProviderState = HealthState.Inexistent
        } else {
          unhealthyProviderState = HealthState.Unhealthy
        }

        // report provider as unhealthy or inexistent
        metrics.observe('third_party_provider_health', thirdPartyProviderMetricLabels, unhealthyProviderState)

        return false
      }
    }
  }
}
