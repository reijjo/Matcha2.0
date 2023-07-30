import React from "react";

export enum Gender {
  Male = "Male",
  Female = "Female",
  Other = "Other",
}

export enum Looking {
  Male = "Male",
  Female = "Female",
  Both = "Both",
}

export interface Coordinates {
  x: number;
  y: number;
}

export interface Location {
  city?: string;
  country?: string;
}

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
  online?: string;
}

export interface Profile {
  user_id: number;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  birthday: string;
  password: string;
  location: Location;
  coordinates: Coordinates;
  gender: Gender;
  seeking: Looking;
  bio: string;
  tags: Array<string>;
  fame: number;
  isonline: boolean;
  online: string;
}

export interface Notification {
  message?: string;
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

export interface Images {
  avatar: boolean;
  created_at: string;
  id: number;
  path: string;
  user_id: number;
}

export interface notifications {
  id: number;
  sender_id: number;
  to_id: number;
  message: string;
  read: number;
}
