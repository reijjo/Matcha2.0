export interface ConfigType {
  PORT?: number;
  POSTGRES_USER?: string;
  POSTGRES_DB?: string;
  PGADMIN_DEFAULT_PASSWORD?: string;
  PGHOST?: string;
  PGPORT?: number;
}

export interface User {
  id: number;
  username: string;
}
