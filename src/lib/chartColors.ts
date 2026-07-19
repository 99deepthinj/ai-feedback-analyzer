export const CHART = {
  primary: '#6D5DF6',
  positive: '#10B981',
  negative: '#EF4444',
  neutral: '#71717A',
  warning: '#F59E0B',
  blue: '#3B82F6',
  cyan: '#06B6D4',
  rose: '#F43F5E',
  grid: '#E5E7EB',
  gridDark: '#27272A',

  palette: ['#6D5DF6', '#10B981', '#EF4444', '#F59E0B', '#06B6D4', '#71717A'],
  sources: {
    G2: '#6D5DF6',
    'App Store': '#06B6D4',
    Capterra: '#10B981',
    Trustpilot: '#F59E0B',
    'Play Store': '#EF4444',
    Other: '#71717A',
  },
} as const

export const tooltipStyle: React.CSSProperties = {
  backgroundColor: 'var(--color-card, #fff)',
  border: '1px solid var(--color-border, #E5E7EB)',
  borderRadius: '10px',
  color: 'var(--color-foreground, #111)',
  fontSize: '12px',
  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
  padding: '8px 12px',
}

export const axisStyle = {
  fontSize: 11,
  fill: '#71717A',
  fontFamily: 'Inter, system-ui, sans-serif',
}
