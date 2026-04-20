import React from 'react';
import { RouterProvider } from '@tanstack/react-router';
import { ConfigProvider } from './context/ConfigContext';
import { NotificationProvider } from './context/NotificationContext';
import { router as defaultRouter } from './router';
import './App.css';

interface AppProps {
  router?: typeof defaultRouter;
}

function App({ router = defaultRouter }: AppProps = {}) {
  return (
    <NotificationProvider>
      <ConfigProvider>
        <RouterProvider router={router} />
      </ConfigProvider>
    </NotificationProvider>
  );
}

export default App;
