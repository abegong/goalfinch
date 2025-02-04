import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { demoData } from '../data/demo_data';
import { DashboardConfig, AppConfig } from '../types/config';
import { ConnectionsConfig } from '../types/connections';
import { LocalStorageService, STORAGE_KEYS } from '../services/storage';
import { useNotification } from './NotificationContext';

interface ConfigContextType {
  dashboard: DashboardConfig;
  setDashboard: React.Dispatch<React.SetStateAction<DashboardConfig>>;
  connections: ConnectionsConfig;
  setConnections: React.Dispatch<React.SetStateAction<ConnectionsConfig>>;
  app: AppConfig;
  setApp: React.Dispatch<React.SetStateAction<AppConfig>>;
}

export const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { showError, showWarning } = useNotification();
  const storage = new LocalStorageService({ showError, showWarning });

  // Load initial state from storage or use defaults
  const [dashboard, setDashboard] = useState<DashboardConfig>(() => {
    try {
      const stored = storage.load<DashboardConfig>(STORAGE_KEYS.DASHBOARD);
      return stored || { slideGroups: demoData };
    } catch (error) {
      return { slideGroups: demoData };
    }
  });

  const [connections, setConnections] = useState<ConnectionsConfig>(() => {
    try {
      const stored = storage.load<ConnectionsConfig>(STORAGE_KEYS.CONNECTIONS);
      return stored || {
        backend: {
          serverUrl: '',
          serverPassword: '',
        },
        pictureSources: [],
        goalSources: []
      };
    } catch (error) {
      return {
        backend: {
          serverUrl: '',
          serverPassword: '',
        },
        pictureSources: [],
        goalSources: []
      };
    }
  });

  const [app, setApp] = useState<AppConfig>(() => {
    try {
      const stored = storage.load<AppConfig>(STORAGE_KEYS.APP);
      return stored || {
        appControlBar: {
          open: false,
          visible: true
        },
        theme: {
          mode: 'light'
        }
      };
    } catch (error) {
      return {
        appControlBar: {
          open: false,
          visible: true
        },
        theme: {
          mode: 'light'
        }
      };
    }
  });

  // Save to storage whenever state changes
  useEffect(() => {
    try {
      storage.save(STORAGE_KEYS.DASHBOARD, dashboard);
    } catch (error) {
      // Error is already handled by storage service
    }
  }, [dashboard]);

  useEffect(() => {
    try {
      storage.save(STORAGE_KEYS.CONNECTIONS, connections);
    } catch (error) {
      // Error is already handled by storage service
    }
  }, [connections]);

  useEffect(() => {
    try {
      storage.save(STORAGE_KEYS.APP, app);
    } catch (error) {
      // Error is already handled by storage service
    }
  }, [app]);

  return (
    <ConfigContext.Provider value={{ 
      dashboard, 
      setDashboard,
      connections,
      setConnections,
      app,
      setApp
    }}>
      {children}
    </ConfigContext.Provider>
  );
};

export function useConfig() {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
}
