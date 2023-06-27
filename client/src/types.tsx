import React from "react";

export interface User {
  id?: number;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  birthday: string;
  password: string;
  confPassword: string;
  verifycode?: string;
  status?: number;
  online?: boolean;
}

export interface Notification {
  message: string;
  style: React.CSSProperties;
  success: boolean;
}

export interface Login {
  username: string;
  password: string;
}

export interface Token {
  token?: string;
}
