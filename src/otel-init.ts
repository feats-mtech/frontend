import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { trace } from '@opentelemetry/api';
import { resourceFromAttributes } from '@opentelemetry/resources';

const provider = new WebTracerProvider({
  resource: resourceFromAttributes({
    'service.name': 'feats-frontend',
  }),
});

const otlpExporter = new OTLPTraceExporter({
  url: window.RUNTIME_CONFIG?.VITE_BACKEND_OTEL_URL || import.meta.env.VITE_BACKEND_OTEL_URL,
});

(provider as any)._activeSpanProcessor = new SimpleSpanProcessor(otlpExporter);
provider.register();

export const tracer = trace.getTracer('web-vitals-tracer');
