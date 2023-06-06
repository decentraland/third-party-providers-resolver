import { parseUrn } from '@dcl/urn-resolver'
import { ThirdPartyProvider } from '../types'

const URN_THIRD_PARTY_NAME_TYPE = 'blockchain-collection-third-party-name'

export default async function parse(thirdPartyProvider: ThirdPartyProvider): Promise<string> {
  const parsedUrn = await parseUrn(thirdPartyProvider.id)

  if (!parsedUrn || parsedUrn.type !== URN_THIRD_PARTY_NAME_TYPE) {
    throw new Error(`Couldn't parse third party id: ${thirdPartyProvider.id}`)
  }

  const baseUrl = new URL(thirdPartyProvider.resolver).href.replace(/\/$/, '')
  const url = `${baseUrl}/registry/${parsedUrn.thirdPartyName}/address/any/assets`

  return url
}
