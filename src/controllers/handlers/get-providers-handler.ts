import { HandlerContextWithPath, ThirdPartyProvider } from '../../types'

type GetProvidersResponse = {
  body: {
    thirdPartyProviders: ThirdPartyProvider[]
  }
}

export async function getProvidersHandler(
  context: Pick<HandlerContextWithPath<'thirdPartyProvidersMemoryStorage', '/providers'>, 'url' | 'components'>
): Promise<GetProvidersResponse> {
  const { thirdPartyProvidersMemoryStorage } = context.components

  const thirdPartyProviders = await thirdPartyProvidersMemoryStorage.get()

  return {
    body: { thirdPartyProviders }
  }
}
