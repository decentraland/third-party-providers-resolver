import { ThirdPartyProviderHealthChecker } from '../../src/adapters/third-party-provider-health-checker'
import { ThirdPartyProvidersFetcher } from '../../src/adapters/third-party-providers-fetcher'
import { createThirdPartyProvidersMemoryStorage } from '../../src/logic/third-party-providers-memory-storage'

describe('memory-storage should', () => {
  const thirdPartyProviders = [
    { id: 'id', metadata: {}, resolver: 'resolver' },
    { id: 'id', metadata: {}, resolver: 'resolver' }
  ]

  const thirdPartyProvidersFetcherMock: ThirdPartyProvidersFetcher = {
    getAll: jest.fn()
  }
  const thirdPartyProvidersHealthCheckerMock: ThirdPartyProviderHealthChecker = {
    isHealthy: jest.fn()
  }

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should call fetcher to retrieve all providers', async () => {
    // Arrange
    thirdPartyProvidersHealthCheckerMock.isHealthy = jest.fn().mockResolvedValue(true)
    thirdPartyProvidersFetcherMock.getAll = jest.fn().mockResolvedValue(thirdPartyProviders)
    const sut = createThirdPartyProvidersMemoryStorage({
      thirdPartyProvidersFetcher: thirdPartyProvidersFetcherMock,
      thirdPartyProviderHealthChecker: thirdPartyProvidersHealthCheckerMock
    })

    // Act
    await sut.get()

    // Assert
    expect(thirdPartyProvidersFetcherMock.getAll).toHaveBeenCalledTimes(1)
  })

  it('should call health checker for each provider retrieved', async () => {
    // Arrange
    thirdPartyProvidersHealthCheckerMock.isHealthy = jest.fn().mockResolvedValue(true)
    thirdPartyProvidersFetcherMock.getAll = jest.fn().mockResolvedValue(thirdPartyProviders)
    const sut = createThirdPartyProvidersMemoryStorage({
      thirdPartyProvidersFetcher: thirdPartyProvidersFetcherMock,
      thirdPartyProviderHealthChecker: thirdPartyProvidersHealthCheckerMock
    })

    // Act
    await sut.get()

    // Assert
    expect(thirdPartyProvidersHealthCheckerMock.isHealthy).toHaveBeenCalledTimes(2)
  })

  it('should reject if no providers were found on first call', async () => {
    // Arrange
    thirdPartyProvidersFetcherMock.getAll = jest.fn().mockResolvedValue([])
    const sut = createThirdPartyProvidersMemoryStorage({
      thirdPartyProvidersFetcher: thirdPartyProvidersFetcherMock,
      thirdPartyProviderHealthChecker: thirdPartyProvidersHealthCheckerMock
    })

    // Act & Assert
    await expect(sut.get()).rejects.toThrow('Could not fetch Third Party providers')
  })

  it('should return cached value on second call', async () => {
    // Arrange
    thirdPartyProvidersFetcherMock.getAll = jest.fn().mockResolvedValue(thirdPartyProviders)
    thirdPartyProvidersHealthCheckerMock.isHealthy = jest.fn().mockResolvedValue(true)
    const sut = createThirdPartyProvidersMemoryStorage({
      thirdPartyProvidersFetcher: thirdPartyProvidersFetcherMock,
      thirdPartyProviderHealthChecker: thirdPartyProvidersHealthCheckerMock
    })

    // Act
    await sut.get() // first call
    const result = await sut.get() // second call

    // Assert
    expect(result).toEqual(thirdPartyProviders)
    expect(thirdPartyProvidersFetcherMock.getAll).toHaveBeenCalledTimes(1)
  })
})
