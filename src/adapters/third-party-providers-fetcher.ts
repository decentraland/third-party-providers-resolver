import { AppComponents, ThirdPartyProvider } from '../types'

export type ThirdPartyProvidersFetcher = {
  getAll(): Promise<ThirdPartyProvider[]>
}

type ThirdPartyResolversQueryResults = {
  thirdParties: ThirdPartyProvider[]
}

const QUERY_ALL_THIRD_PARTY_RESOLVERS = `
{
  thirdParties(where: {isApproved: true}) {
    id
    resolver
    metadata {
      thirdParty {
        name
        description
        contracts {
          network
          address
        }
      }
    }
  }
}
`

export function createThirdPartyProvidersFetcher({
  theGraph,
  logs
}: Pick<AppComponents, 'theGraph' | 'logs'>): ThirdPartyProvidersFetcher {
  const logger = logs.getLogger('third-party-providers-fetcher')

  return {
    async getAll(): Promise<ThirdPartyProvider[]> {
      try {
        const queryResult = await theGraph.thirdPartyRegistrySubgraph.query<ThirdPartyResolversQueryResults>(
          QUERY_ALL_THIRD_PARTY_RESOLVERS,
          {},
          1
        )

        for (const thirdParty of queryResult.thirdParties) {
          if (thirdParty.metadata.thirdParty.contracts) {
            thirdParty.metadata.thirdParty.contracts = thirdParty.metadata.thirdParty.contracts.map((c) => ({
              network: c.network.toLowerCase(),
              address: c.address.toLowerCase()
            }))
          }
        }

        return queryResult.thirdParties
      } catch (error: any) {
        logger.error('Failed while retrieving all Third Party providers')
        return []
      }
    }
  }
}
