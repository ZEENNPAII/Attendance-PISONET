import { AuthUser } from '@/types';
import { authenticatePlayer, authenticateAdmin } from './database';

// Simple session management (in production, use proper session management)
let currentUser: AuthUser | null = null;

export const loginPlayer = (username: string, password: string): boolean => {
  if (authenticatePlayer(username, password)) {
    currentUser = { username, role: 'player' };
    return true;
  }
  return false;
};

export const loginAdmin = (username: string, password: string): boolean => {
  if (authenticateAdmin(username, password)) {
    currentUser = { username, role: 'admin' };
    return true;
  }
  return false;
};

export const logout = (): void => {
  currentUser = null;
};

export const getCurrentUser = (): AuthUser | null => {
  return currentUser;
};

export const isAuthenticated = (): boolean => {
  return currentUser !== null;
};

export const isAdmin = (): boolean => {
  return currentUser?.role === 'admin';
};

export const isPlayer = (): boolean => {
  return currentUser?.role === 'player';
};
