import React from 'react';
import { render, screen, within } from '@testing-library/react';
import App from './App';

test('renders Goal Finch logo in AppControlBar', () => {
  render(<App />);
  const appControlBar = screen.getByLabelText('App Control Bar');
  const logoElement = within(appControlBar).getByRole('img', { name: 'Goal Finch Logo' });
  expect(logoElement).toBeInTheDocument();
  expect(logoElement.getAttribute('src')).toBe('/goldfinch-logo.svg');
});
