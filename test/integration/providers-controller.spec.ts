import { ThirdPartyProvider } from '../../src/types'
import { test, testWithComponents } from '../components'
import { createTheGraphComponentMock } from '../mocks/the-graph-mock'

testWithComponents(() => {
  const theGraphMock = createTheGraphComponentMock()
  const resolverResponse = {
    thirdParties: [
      {
        id: 'urn:decentraland:mumbai:collections-thirdparty:ignore-me',
        resolver: 'https://resolver-healthy.zone/v1',
        metadata: {
          thirdParty: {
            name: 'healthy',
            description: 'description'
          }
        }
      },
      {
        id: 'urn:decentraland:mumbai:collections-thirdparty:ignore-me',
        resolver: 'https://resolver-unhealthy.zone/v1',
        metadata: {
          thirdParty: {
            name: 'unhealthy',
            description: 'description'
          }
        }
      }
    ] as ThirdPartyProvider[]
  }

  theGraphMock.thirdPartyRegistrySubgraph.query = jest.fn().mockResolvedValue(resolverResponse)
  const fetchComponentMock = {
    fetch: jest.fn().mockImplementation((url) => {
      if (url.includes('unhealthy')) return Promise.reject({})
      else return Promise.resolve({})
    })
  }

  return {
    theGraph: theGraphMock,
    fetch: fetchComponentMock
  }
})('/providers endpoint', ({ components }) => {
  it('responds with healthy providers', async () => {
    const { localFetch } = components

    const response = await localFetch.fetch('/providers')
    const responseBody = await response.json()

    expect(response.status).toEqual(200)
    expect(responseBody.thirdPartyProviders).toEqual([
      {
        id: 'urn:decentraland:mumbai:collections-thirdparty:ignore-me',
        resolver: 'https://resolver-healthy.zone/v1',
        metadata: {
          thirdParty: {
            name: 'healthy',
            description: 'description'
          }
        }
      }
    ])
  })
})
