import React, { createContext, useContext, useState, ReactNode } from 'react';
import { demoData } from '../data/demo_data';
import { SlideGroupConfig } from '../types/slide_groups';

export interface DashboardConfig {
  slideGroups: SlideGroupConfig[];
}

export interface ConnectionConfig {
  type: 'GOOGLE_SHEETS' | 'AIRTABLE';
  name: string;
  apiKey?: string;
  sheetId?: string;
  baseId?: string;
  tableId?: string;
}

export interface ConnectionsConfig {
  connections: ConnectionConfig[];
}

export interface AppConfig {
  appControlBar: {
    open: boolean;
    visible: boolean;
  };
  theme: {
    mode: 'light' | 'dark';
  };
}

interface ConfigContextType {
  dashboard: DashboardConfig;
  setDashboard: React.Dispatch<React.SetStateAction<DashboardConfig>>;
  connections: ConnectionsConfig;
  setConnections: React.Dispatch<React.SetStateAction<ConnectionsConfig>>;
  app: AppConfig;
  setApp: React.Dispatch<React.SetStateAction<AppConfig>>;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [dashboard, setDashboard] = useState<DashboardConfig>({
    slideGroups: demoData
  });

  const [connections, setConnections] = useState<ConnectionsConfig>({
    connections: []
  });

  const [app, setApp] = useState<AppConfig>({
    appControlBar: {
      open: false,
      visible: true
    },
    theme: {
      mode: 'light'
    }
  });

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
