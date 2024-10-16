# Third Party Providers Resolver

This service filters and returns the [Third Party Providers](https://adr.decentraland.org/adr/ADR-42) that are in a healthy state.

The purpose of this service is to prevent unnecessary timeouts for consumers by avoiding calls to API resolvers that are unresponsive or offline when validating item ownership.

## Implementation

What this service does:

1. Retrieves all Third Party Providers from TheGraph
2. Checks the health of each Third Party Provider by fetching the endpoint required in the [ADR-42](https://adr.decentraland.org/adr/ADR-42)
3. Caches the providers that are healthy in a memory storage (_LRU cache_)
4. Returns the healthy providers every time the endpoint `GET /providers` is called

### What healthy means on this service's context?

If any Third Party Provider's endpoint returns a `200 OK` status code when fetched, it will be regarded as **healthy**.

## Exposed endpoints

This service only exposes `GET /providers` endpoint which returns a JSON containing the healthy providers (_the unhealthy providers are not returned on this endpoint_). Response example:

```json
{
  "thirdPartyProviders": [
    {
      "id": "urn:decentraland:mumbai:collections-thirdparty:first-collection",
      "resolver": "https://third-party-resolver-api.decentraland.zone/v1",
      "metadata": {
        "thirdParty": {
          "name": "First collection",
          "description": "Nonexistent: only for docs purposes."
        }
      }
    },
    {
      "id": "urn:decentraland:mumbai:collections-thirdparty:second-collection",
      "resolver": "https://third-party-resolver-api.decentraland.zone/v1",
      "metadata": {
        "thirdParty": {
          "name": "Second collection",
          "description": "Nonexistent: only for docs purposes."
        }
      }
    }
  ]
}
```
