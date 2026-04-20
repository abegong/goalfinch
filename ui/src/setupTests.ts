// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock vega-lite and react-vega
jest.mock('vega-lite', () => ({}));
jest.mock('react-vega', () => ({
  VegaLite: () => null
}));

// Mock reveal.js: its CSS import and DOM-heavy initialization are not
// compatible with jsdom-based tests. Stub the constructor so SlideDeck can
// mount without side effects.
jest.mock('reveal.js/reveal.css', () => ({}), { virtual: true });
jest.mock('reveal.js', () => {
  class MockReveal {
    initialize = jest.fn().mockResolvedValue(undefined);
    destroy = jest.fn();
    sync = jest.fn();
    layout = jest.fn();
    configure = jest.fn();
    slide = jest.fn();
    on = jest.fn();
    off = jest.fn();
    getIndices = jest.fn().mockReturnValue({ h: 0, v: 0, f: 0 });
  }
  return {
    __esModule: true,
    default: MockReveal,
  };
});

// Add a polyfill for structuredClone
if (typeof structuredClone === 'undefined') {
  global.structuredClone = (obj: any) => JSON.parse(JSON.stringify(obj));
}
