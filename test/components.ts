// This file is the "test-environment" analogous for src/components.ts
// Here we define the test components to be used in the testing environment

import { createRunner, createLocalFetchCompoment, defaultServerConfig } from '@well-known-components/test-helpers'
import { main } from '../src/service'
import { TestComponents } from '../src/types'
import { initComponents as originalInitComponents } from '../src/components'
import { createConfigComponent } from '@well-known-components/env-config-provider'
import { createTestMetricsComponent } from '@well-known-components/metrics'
import { metricDeclarations } from '../src/metrics'

/**
 * Behaves like Jest "describe" function, used to describe a test for a
 * use case, it creates a whole new program and components to run an
 * isolated test.
 *
 * State is persistent within the steps of the test.
 */
export const test = createRunner<TestComponents>({
  main,
  initComponents
})

export function testWithComponents(
  preConfigureComponents: () => Partial<TestComponents> //{ fetchComponent?: IFetchComponent; theGraphComponent?: TheGraphComponent }
) {
  const preConfiguredComponents = preConfigureComponents()
  return createRunner<TestComponents>({
    main,
    initComponents: () => initComponents(preConfiguredComponents)
  })
}

async function initComponents(overridenComponents?: Partial<TestComponents>): Promise<TestComponents> {
  const config = createConfigComponent({ ...defaultServerConfig(), HTTP_SERVER_PORT: '7373' })
  const components = await originalInitComponents(overridenComponents)

  return {
    ...components,
    ...overridenComponents,
    metrics: createTestMetricsComponent(metricDeclarations),
    localFetch: await createLocalFetchCompoment(config)
  }
}
