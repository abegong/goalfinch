import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { describe, it, test, expect, vi } from 'vitest';
import { createMemoryHistory } from '@tanstack/react-router';
import App from './App';
import { createAppRouter } from './router';
import { ConfigContext } from './context/ConfigContext';
import { SlideType } from './types/slides';
import { type BulletSlideGroupConfig } from './types/slide_groups';
import { type DashboardConfig } from './types/config';

const defaultConfig = {
  connections: {
    backend: null,
    pictureSources: [],
    dataSources: []
  },
  dashboard: {
    slideGroups: [{
      type: SlideType.BULLETS as const,
      name: "Bullet Slides",
      slides: [{
        type: SlideType.BULLETS as const,
        bullets: ['Test bullet point', 'Another test bullet point']
      }],
      captions: {}
    } as BulletSlideGroupConfig]
  } as DashboardConfig,
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

const mockSetConnections = vi.fn();
const mockSetDashboard = vi.fn();
const mockSetApp = vi.fn();

async function renderAt(path: string) {
  const router = createAppRouter(createMemoryHistory({ initialEntries: [path] }));
  await router.load();
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
      <App router={router} />
    </ConfigContext.Provider>
  );
}

describe('App smoke tests', () => {
  it('renders home page', async () => {
    await renderAt('/');
    expect(await screen.findByRole('heading', { name: 'Goal Finch', level: 2 })).toBeInTheDocument();
  });

  it('renders dashboard page', async () => {
    await renderAt('/dashboard');
  });

  it('renders configure slides page', async () => {
    await renderAt('/slides');
  });

  it('renders configure connections page', async () => {
    await renderAt('/connections');
    expect(await screen.findByText('Configure Connections')).toBeInTheDocument();
  });
});

test('renders Goal Finch logo in AppControlBar', async () => {
  const router = createAppRouter(createMemoryHistory({ initialEntries: ['/'] }));
  await router.load();
  render(<App router={router} />);
  const appControlBar = await screen.findByLabelText('App Control Bar');
  const logoElement = within(appControlBar).getByRole('img', { name: 'Goal Finch Logo' });
  expect(logoElement).toBeInTheDocument();
  expect(logoElement.getAttribute('src')).toBe('/goldfinch-logo.svg');
});
