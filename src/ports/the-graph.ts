import { IBaseComponent } from '@well-known-components/interfaces'
import { ISubgraphComponent, createSubgraphComponent } from '@well-known-components/thegraph-component'
import { AppComponents } from '../types'

export type TheGraphComponent = IBaseComponent & {
  thirdPartyRegistrySubgraph: ISubgraphComponent
}

export async function createTheGraphComponent(
  components: Pick<AppComponents, 'config' | 'logs' | 'fetch' | 'metrics'>
): Promise<TheGraphComponent> {
  const { config } = components

  const thirdPartyRegistrySubgraphURL: string | undefined = await config.getString('SUBGRAPH_URL')

  if (!thirdPartyRegistrySubgraphURL) throw new Error('The environment variable SUBGRAPH_URL must be set.')

  const thirdPartyRegistrySubgraph = await createSubgraphComponent(components, thirdPartyRegistrySubgraphURL)

  return {
    thirdPartyRegistrySubgraph
  }
}
