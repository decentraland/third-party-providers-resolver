import { validateMetricsDeclaration } from '@well-known-components/metrics'
import { metricDeclarations as theGraphMetricsDeclarations } from '@well-known-components/thegraph-component'
import { metricDeclarations as logsMetricsDeclarations } from '@well-known-components/logger'
import { getDefaultHttpMetrics } from '@well-known-components/http-server'

// type assertions
export const metricsDeclaration = validateMetricsDeclaration({
  ...getDefaultHttpMetrics(),
  ...logsMetricsDeclarations,
  ...theGraphMetricsDeclarations,
  third_party_provider_health: {
    help: 'Tracks the health of Third Party Providers',
    type: 'gauge',
    labelNames: ['providerId', 'providerName']
  }
})
