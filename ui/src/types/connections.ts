/**
 * Types related to external service connections in Goal Finch.
 */

/**
 * Represents a named source with a URL
 */
export interface SourceConfig {
  name: string;
  url: string;
}

/**
 * Configuration for the self-hosted backend connection
 */
export interface BackendConfig {
  serverUrl: string;
  serverPassword: string;
}

/**
 * Complete connections configuration for Goal Finch
 */
export interface ConnectionsConfig {
  backend: BackendConfig | null;
  pictureSources: SourceConfig[];
  dataSources: SourceConfig[];
}
