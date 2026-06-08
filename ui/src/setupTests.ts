import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock('vega-lite', () => ({}));
vi.mock('react-vega', () => ({
  VegaLite: () => null,
}));

vi.mock('reveal.js/reveal.css', () => ({}));
vi.mock('reveal.js', () => {
  class MockReveal {
    initialize = vi.fn().mockResolvedValue(undefined);
    destroy = vi.fn();
    sync = vi.fn();
    layout = vi.fn();
    configure = vi.fn();
    slide = vi.fn();
    on = vi.fn();
    off = vi.fn();
    getIndices = vi.fn().mockReturnValue({ h: 0, v: 0, f: 0 });
  }
  return {
    __esModule: true,
    default: MockReveal,
  };
});

if (typeof structuredClone === 'undefined') {
  (globalThis as { structuredClone?: typeof structuredClone }).structuredClone =
    <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
}

// jsdom has no layout engine, so window.scrollTo throws "Not implemented".
// TanStack Router's scroll restoration calls it during navigation in tests.
if (typeof window !== 'undefined') {
  window.scrollTo = vi.fn();
}
