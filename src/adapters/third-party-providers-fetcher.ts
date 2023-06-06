import { AppComponents, ThirdPartyProvider } from '../types'

export type ThirdPartyProvidersFetcher = {
  getAll(): Promise<ThirdPartyProvider[]>
}

export type ThirdPartyResolversQueryResults = {
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

        return queryResult.thirdParties
      } catch (error: any) {
        logger.error('Failed while retrieving all Third Party providers')
        return []
      }
    }
  }
}
