import { ISubgraphComponent } from '@well-known-components/thegraph-component'
import { TheGraphComponent } from '../../src/ports/the-graph'

const createMockSubgraphComponent = (): ISubgraphComponent => ({
  query: jest.fn()
})

export function createTheGraphComponentMock(): TheGraphComponent {
  return {
    start: async () => {},
    stop: async () => {},
    thirdPartyRegistrySubgraph: createMockSubgraphComponent()
  }
}
