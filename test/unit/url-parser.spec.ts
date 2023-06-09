import { ThirdPartyProvider } from '../../src/types'
import { default as sut } from './../../src/logic/third-party-url-parser'

describe('url-parser should', () => {
  it('correctly parse a Third Party Provider', async () => {
    const thirdPartyProvider: ThirdPartyProvider = {
      id: 'urn:decentraland:mumbai:collections-thirdparty:ignore-me',
      resolver: 'https://third-party-resolver-api.decentraland.zone/v1',
      metadata: { thirdParty: { name: 'Ignore me', description: 'Ignore me' } }
    }

    const result = await sut(thirdPartyProvider)

    expect(result).toBe(
      'https://third-party-resolver-api.decentraland.zone/v1/registry/ignore-me/address/0x6438c3b1fa97ba144ea38fcbcee5f0ccf4539b1d/assets'
    )
  })

  it('throw an error if the Third Party Provider id is invalid', async () => {
    const thirdpartyProvider: ThirdPartyProvider = {
      id: 'urn:decentraland:mumbai:invalid:ignore-me',
      resolver: 'https://third-party-resolver-api.decentraland.zone/v1',
      metadata: { thirdParty: { name: 'Ignore me', description: 'Ignore me' } }
    }
    await expect(sut(thirdpartyProvider)).rejects.toThrow(
      `Could not parse third party id: urn:decentraland:mumbai:invalid:ignore-me`
    )
  })
})
