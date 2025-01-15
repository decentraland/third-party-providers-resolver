import { ThirdPartyProvider } from '../types'
import { ThirdPartyProviderHealthChecker } from './third-party-provider-health-checker'

export function createMockedThirdPartyProviderHealthComponent(): ThirdPartyProviderHealthChecker {
  return {
    async isHealthy(_thirdPartyProvider: ThirdPartyProvider): Promise<boolean> {
      return false
    }
  }
}
