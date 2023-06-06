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
  logs
}: Pick<AppComponents, 'fetch' | 'logs'>): ThirdPartyProviderHealthChecker {
  const logger = logs.getLogger('third-party-provider-health-checker')

  return {
    async isHealthy(thirdPartyProvider: ThirdPartyProvider): Promise<boolean> {
      const thirdPartyUrl: string = await parse(thirdPartyProvider)

      try {
        await fetch.fetch(thirdPartyUrl)

        return true
      } catch (err: any) {
        logger.warn('The following Third Party Provider is unhealthy.', {
          thirdPartyProvider: thirdPartyProvider.id,
          thirdPartyUrl
        })

        if (isThirdPartyProviderDisabled(err)) {
          logger.error('Domain was not resolved')
        }

        return false
      }
    }
  }
}
