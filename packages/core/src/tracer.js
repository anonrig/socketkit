import { NodeTracerProvider } from '@opentelemetry/node'
import { JaegerExporter } from '@opentelemetry/exporter-jaeger'
import { SimpleSpanProcessor } from '@opentelemetry/tracing'
import { registerInstrumentations } from '@opentelemetry/instrumentation'
import api from '@opentelemetry/api'

const provider = new NodeTracerProvider({
  plugins: {
    pg: {
      enabled: true,
      path: '@opentelemetry/plugin-pg',
    },
    'pg-pool': {
      enabled: true,
      path: '@opentelemetry/plugin-pg-pool',
    },
    '@grpc/grpc-js': {
      enabled: true,
      path: '@opentelemetry/plugin-grpc-js',
    },
  },
})

provider.addSpanProcessor(
  new SimpleSpanProcessor(
    new JaegerExporter({
      serviceName: 'subscription-worker',
      endpoint:
        'http://linkerd-jaeger.linkerd.svc.cluster.local:14268/api/traces',
    }),
  ),
)

provider.register()

registerInstrumentations({
  tracerProvider: provider,
})

export const telemetryApi = api
export default provider
