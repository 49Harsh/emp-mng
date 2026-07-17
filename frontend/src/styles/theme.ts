export const colors = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  success: { light: '#d1fae5', DEFAULT: '#10b981', dark: '#065f46' },
  warning: { light: '#fef3c7', DEFAULT: '#f59e0b', dark: '#78350f' },
  danger: { light: '#fee2e2', DEFAULT: '#ef4444', dark: '#7f1d1d' },
} as const;

export const chartColors = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#ec4899', // pink
] as const;

export const roleColors: Record<string, string> = {
  super_admin: '#7c3aed',
  hr_manager: '#0891b2',
  employee: '#059669',
};

export const statusColors: Record<string, string> = {
  active: '#10b981',
  inactive: '#6b7280',
};
