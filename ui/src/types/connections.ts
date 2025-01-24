/**
 * Types related to external service connections in Goal Finch.
 */

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
