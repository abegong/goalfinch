import React from 'react';
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  type RouterHistory,
} from '@tanstack/react-router';
import Layout from './components/Layout';
import Home from './components/pages/Home';
import Dashboard from './components/pages/Dashboard';
import ConfigureSlides from './components/pages/ConfigureSlides';
import ConfigureConnections from './components/pages/ConfigureConnections';

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: Dashboard,
});

const slidesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/slides',
  component: ConfigureSlides,
});

const connectionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/connections',
  component: ConfigureConnections,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  dashboardRoute,
  slidesRoute,
  connectionsRoute,
]);

export function createAppRouter(history?: RouterHistory) {
  return createRouter({ routeTree, history });
}

export const router = createAppRouter();

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
