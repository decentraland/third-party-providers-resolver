import { getDefaultHttpMetrics, validateMetricsDeclaration } from '@well-known-components/metrics'
import { metricDeclarations as theGraphMetricsDeclarations } from '@well-known-components/thegraph-component'
import { metricDeclarations as logsMetricsDeclarations } from '@well-known-components/logger'

export const metricDeclarations = {
  ...getDefaultHttpMetrics(),
  ...logsMetricsDeclarations,
  ...theGraphMetricsDeclarations
}

// type assertions
validateMetricsDeclaration(metricDeclarations)
