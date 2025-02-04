import React from 'react';
import { render, screen, within } from '@testing-library/react';
import App from './App';
import { ConfigContext } from './context/ConfigContext';

const defaultConfig = {
  connections: {
    backend: {
      serverUrl: '',
      serverPassword: '',
    },
    pictureSources: [],
    goalSources: []
  },
  dashboard: {
    slideGroups: []
  },
  app: {
    appControlBar: {
      open: false,
      visible: true
    },
    theme: {
      mode: 'light' as const
    }
  }
};

const mockSetConnections = jest.fn();
const mockSetDashboard = jest.fn();
const mockSetApp = jest.fn();

const renderWithConfig = () => {
  return render(
    <ConfigContext.Provider 
      value={{
        connections: defaultConfig.connections,
        setConnections: mockSetConnections,
        dashboard: defaultConfig.dashboard,
        setDashboard: mockSetDashboard,
        app: defaultConfig.app,
        setApp: mockSetApp
      }}
    >
      <App />
    </ConfigContext.Provider>
  );
};

describe('App smoke tests', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/');
  });

  // it('renders home page', () => {
  //   renderWithConfig();
  //   expect(screen.getByRole('heading', { name: 'Goal Finch' })).toBeInTheDocument();
  // });

  it('renders dashboard page', () => {
    window.history.pushState({}, '', '/dashboard');
    renderWithConfig();
    // expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
  });

  // it('renders configure slides page', () => {
  //   window.history.pushState({}, '', '/slides');
  //   renderWithConfig();
  //   expect(screen.getByText('Configure Slides')).toBeInTheDocument();
  // });

  it('renders configure connections page', () => {
    window.history.pushState({}, '', '/connections');
    renderWithConfig();
    expect(screen.getByText('Configure Connections')).toBeInTheDocument();
  });
});

test('renders Goal Finch logo in AppControlBar', () => {
  render(<App />);
  const appControlBar = screen.getByLabelText('App Control Bar');
  const logoElement = within(appControlBar).getByRole('img', { name: 'Goal Finch Logo' });
  expect(logoElement).toBeInTheDocument();
  expect(logoElement.getAttribute('src')).toBe('/goldfinch-logo.svg');
});
