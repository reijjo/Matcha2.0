export interface ConfigType {
  PORT?: number;
  POSTGRES_USER?: string;
  POSTGRES_DB?: string;
  PGADMIN_DEFAULT_PASSWORD?: string;
  PGHOST?: string;
  PGPORT?: number;
  EMAIL_USER?: string;
  EMAIL_PASSWD?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  birthday: string;
  password: string;
  confPassword: string;
  verifycode: string;
  status: number;
  online: boolean;
}

export interface Notification {
  message: string;
  style: object;
  success: boolean;
}
