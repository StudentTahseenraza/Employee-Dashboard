export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Employee Dashboard';
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  EMPLOYEES: '/employees',
  EMPLOYEE_DETAILS: '/employee/:id',
  CAPTURE: '/capture',
  PHOTO_RESULT: '/photo-result',
  SALARY_CHART: '/salary-chart',
  CITY_MAP: '/city-map',
};

export const API_ENDPOINTS = {
  EMPLOYEES: '/backend_dev/gettabledata.php',
};

export const COLORS = {
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  success: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
  info: '#6366f1',
};

export const CHART_COLORS = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
  '#f97316',
  '#6b7280',
  '#94a3b8',
];