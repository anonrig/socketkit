import openTelemetry from '@opentelemetry/api'
import {
  BasicTracerProvider,
  SimpleSpanProcessor,
} from '@opentelemetry/tracing'
import { JaegerExporter } from '@opentelemetry/exporter-jaeger'

const provider = new BasicTracerProvider()
const exporter = new JaegerExporter({ serviceName: 'subscription-worker' })
provider.addSpanProcessor(new SimpleSpanProcessor(exporter))
provider.register()

export default openTelemetry
