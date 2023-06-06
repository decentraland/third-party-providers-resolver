import { HandlerContextWithPath } from '../../types'

export async function getProvidersHandler(
  context: Pick<HandlerContextWithPath<'thirdPartyProvidersMemoryStorage', '/providers'>, 'url' | 'components'>
) {
  const { thirdPartyProvidersMemoryStorage } = context.components

  const thirdPartyProviders = await thirdPartyProvidersMemoryStorage.get()

  return {
    body: { thirdPartyProviders }
  }
}
