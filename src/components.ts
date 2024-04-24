import { createDotEnvConfigComponent } from '@well-known-components/env-config-provider'
import {
  createServerComponent,
  createStatusCheckComponent,
  instrumentHttpServerWithPromClientRegistry
} from '@well-known-components/http-server'
import { createLogComponent } from '@well-known-components/logger'
import { createFetchComponent } from '@well-known-components/fetch-component'
import { createMetricsComponent } from '@well-known-components/metrics'
import { AppComponents, GlobalContext } from './types'
import { metricsDeclaration } from './metrics'
import { IFetchComponent } from '@well-known-components/interfaces'
import { createTheGraphComponent, TheGraphComponent } from './ports/the-graph'
import { createThirdPartyProviderHealthComponent } from './adapters/third-party-provider-health-checker'
import { createThirdPartyProvidersFetcher } from './adapters/third-party-providers-fetcher'
import { createThirdPartyProvidersMemoryStorage } from './logic/third-party-providers-memory-storage'

// Initialize all the components of the app
export async function initComponents(injectedComponents?: Partial<AppComponents>): Promise<AppComponents> {
  const config = await createDotEnvConfigComponent({ path: ['.env.default', '.env'] })
  const metrics = await createMetricsComponent(metricsDeclaration, { config })
  const logs = await createLogComponent({ metrics })
  const server = await createServerComponent<GlobalContext>({ config, logs }, {})
  const statusChecks = await createStatusCheckComponent({ server, config })

  const fetch: IFetchComponent =
    injectedComponents?.fetch ?? createFetchComponent({ defaultHeaders: { Origin: 'third-party-resolver' } })
  const theGraph: TheGraphComponent =
    injectedComponents?.theGraph ?? (await createTheGraphComponent({ config, logs, fetch, metrics }))

  const thirdPartyProvidersFetcher = createThirdPartyProvidersFetcher({ theGraph, logs })
  const thirdPartyProviderHealthChecker = createThirdPartyProviderHealthComponent({ fetch, logs, metrics })
  const thirdPartyProvidersMemoryStorage = createThirdPartyProvidersMemoryStorage({
    thirdPartyProvidersFetcher,
    thirdPartyProviderHealthChecker
  })

  await instrumentHttpServerWithPromClientRegistry({ metrics, server, config, registry: metrics.registry! })

  return {
    config,
    logs,
    server,
    statusChecks,
    fetch,
    metrics,
    theGraph,
    thirdPartyProvidersFetcher,
    thirdPartyProvidersMemoryStorage,
    thirdPartyProviderHealthChecker
  }
}
