import { IBaseComponent } from '@well-known-components/interfaces'
import { ISubgraphComponent, createSubgraphComponent } from '@well-known-components/thegraph-component'
import { AppComponents } from '../types'

const DEFAULT_THIRD_PARTY_REGISTRY_SUBGRAPH_MATIC_MUMBAI =
  'https://api.thegraph.com/subgraphs/name/decentraland/tpr-matic-mumbai'
const DEFAULT_THIRD_PARTY_REGISTRY_SUBGRAPH_MATIC_MAINNET =
  'https://api.thegraph.com/subgraphs/name/decentraland/tpr-matic-mainnet'

export type TheGraphComponent = IBaseComponent & {
  thirdPartyRegistrySubgraph: ISubgraphComponent
}

export async function createTheGraphComponent(
  components: Pick<AppComponents, 'config' | 'logs' | 'fetch' | 'metrics'>
): Promise<TheGraphComponent> {
  const { config } = components

  const ethNetwork = await config.getString('ETH_NETWORK')
  const thirdPartyRegistrySubgraphURL: string =
    (await config.getString('THIRD_PARTY_REGISTRY_SUBGRAPH_URL')) ??
    (ethNetwork === 'mainnet'
      ? DEFAULT_THIRD_PARTY_REGISTRY_SUBGRAPH_MATIC_MAINNET
      : DEFAULT_THIRD_PARTY_REGISTRY_SUBGRAPH_MATIC_MUMBAI)

  const thirdPartyRegistrySubgraph = await createSubgraphComponent(components, thirdPartyRegistrySubgraphURL)

  return {
    thirdPartyRegistrySubgraph
  }
}
