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

// Add a polyfill for structuredClone
if (typeof structuredClone === 'undefined') {
  global.structuredClone = (obj: any) => JSON.parse(JSON.stringify(obj));
}
