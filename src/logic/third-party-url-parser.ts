import { BlockchainCollectionThirdPartyName, parseUrn } from '@dcl/urn-resolver'
import { ThirdPartyProvider } from '../types'

const URN_THIRD_PARTY_NAME_TYPE = 'blockchain-collection-third-party-name'
const ANY_WALLET = '0x6438c3b1fa97ba144ea38fcbcee5f0ccf4539b1d'

export async function checkProviderUrn(assetUrn: string): Promise<BlockchainCollectionThirdPartyName> {
  const parsedUrn = await parseUrn(assetUrn)

  if (!parsedUrn || parsedUrn.type !== URN_THIRD_PARTY_NAME_TYPE) {
    throw new Error(`Could not parse third party id: ${assetUrn}`)
  }

  return parsedUrn
}

export async function parse(thirdPartyProvider: ThirdPartyProvider): Promise<string> {
  const parsedUrn = await checkProviderUrn(thirdPartyProvider.id)
  const baseUrl = new URL(thirdPartyProvider.resolver).href.replace(/\/$/, '')

  return `${baseUrl}/registry/${parsedUrn.thirdPartyName}/address/${ANY_WALLET}/assets`
}
