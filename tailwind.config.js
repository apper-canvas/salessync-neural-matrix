/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        secondary: '#1E40AF',
        accent: '#FB923C',
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a'
        },
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6'
      },
      fontFamily: { 
        heading: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui'] 
      },
      animation: {
        'check': 'check 300ms ease-out forwards',
        'pulse-success': 'pulse-success 500ms ease-out forwards'
      },
      keyframes: {
        check: {
          '0%': { transform: 'scale(0)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' }
        },
        'pulse-success': {
          '0%': { backgroundColor: 'rgb(16, 185, 129)' },
          '50%': { backgroundColor: 'rgb(34, 197, 94)' },
          '100%': { backgroundColor: 'rgb(16, 185, 129)' }
        }
      }
    },
  },
  plugins: [],
}