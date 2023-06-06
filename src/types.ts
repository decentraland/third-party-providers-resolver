import type { IFetchComponent } from '@well-known-components/http-server'
import type {
  IConfigComponent,
  ILoggerComponent,
  IHttpServerComponent,
  IBaseComponent,
  IMetricsComponent
} from '@well-known-components/interfaces'
import { metricDeclarations } from './metrics'
import { TheGraphComponent } from './ports/the-graph'
import { ThirdPartyProvidersFetcher } from './adapters/third-party-providers-fetcher'
import { ThirdPartyProviderHealthChecker } from './adapters/third-party-provider-health-checker'
import { ThirdPartyProvidersMemoryStorage } from './logic/third-party-providers-memory-storage'

export type GlobalContext = {
  components: BaseComponents
}

// components used in every environment
export type BaseComponents = {
  config: IConfigComponent
  logs: ILoggerComponent
  server: IHttpServerComponent<GlobalContext>
  fetch: IFetchComponent
  metrics: IMetricsComponent<keyof typeof metricDeclarations>
  theGraph: TheGraphComponent
  thirdPartyProvidersFetcher: ThirdPartyProvidersFetcher
  thirdPartyProvidersMemoryStorage: ThirdPartyProvidersMemoryStorage
  thirdPartyProviderHealthChecker: ThirdPartyProviderHealthChecker
}

// components used in runtime
export type AppComponents = BaseComponents & {
  statusChecks: IBaseComponent
}

// components used in tests
export type TestComponents = BaseComponents & {
  // A fetch component that only hits the test server
  localFetch: IFetchComponent
}

// this type simplifies the typings of http handlers
export type HandlerContextWithPath<
  ComponentNames extends keyof AppComponents,
  Path extends string = any
> = IHttpServerComponent.PathAwareContext<
  IHttpServerComponent.DefaultContext<{
    components: Pick<AppComponents, ComponentNames>
  }>,
  Path
>

export type Context<Path extends string = any> = IHttpServerComponent.PathAwareContext<GlobalContext, Path>

export type ThirdPartyProvider = {
  id: string
  resolver: string
  metadata: {
    thirdParty: {
      name: string
      description: string
    }
  }
}
