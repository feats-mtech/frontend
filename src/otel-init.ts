import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { trace } from '@opentelemetry/api';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { CLSMetric, FCPMetric, LCPMetric, TTFBMetric, INPMetric } from 'web-vitals';

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

export const reportWebVitals = (
  metric: CLSMetric | FCPMetric | LCPMetric | TTFBMetric | INPMetric,
) => {
  const span = tracer.startSpan(`WebVital:${metric.name}`);
  span.setAttribute('value', metric.value);
  span.setAttribute('rating', metric.rating);
  span.setAttribute('delta', metric.delta);
  span.setAttribute('id', metric.id);

  // console.log(`${metric.name}: ${metric.value}, ${metric.rating}`);
  metric.entries?.forEach((entry, index) => {
    span.setAttribute(`entry[${index}].startTime`, entry.startTime);
    span.setAttribute(`entry[${index}].duration`, entry.duration);
  });
  span.end();
  if (metric.entries) {
    span.setAttribute('entries.length', metric.entries.length);
  }
};

export const tracer = trace.getTracer('web-vitals-tracer');
