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
    (obj) => JSON.parse(JSON.stringify(obj)) as unknown;
}
