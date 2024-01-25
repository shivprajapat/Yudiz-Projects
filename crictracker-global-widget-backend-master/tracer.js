'use strict'

const process = require('process')
const opentelemetry = require('@opentelemetry/sdk-node')
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node')
// eslint-disable-next-line no-unused-vars
const { ConsoleSpanExporter } = require('@opentelemetry/sdk-trace-base')
const { Resource } = require('@opentelemetry/resources')
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions')
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http')

const exporter = new OTLPTraceExporter({
  url: 'http://signoz-otel-collector.monitoring.svc.cluster.local:4318/v1/traces'
})
const sdk = new opentelemetry.NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'global-widget-dev'
  }),
  traceExporter: exporter,
  instrumentations: [getNodeAutoInstrumentations()]
})

sdk
  .start()
  .then(() => {
    console.log('Tracing initialized')
  })
  .catch((error) => console.log('Error initializing tracing', error))

process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((error) => console.log('Error terminating tracing', error))
    .finally(() => process.exit(0))
})