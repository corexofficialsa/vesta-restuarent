/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        purple: {
          50: '#f5f3ff', 100: '#ede9fe', 200: '#ddd6fe', 300: '#c4b5fd',
          400: '#a78bfa', 500: '#8b5cf6', 600: '#7c3aed', 700: '#6d28d9',
          800: '#5b21b6', 900: '#4c1d95', 950: '#2e1065',
        },
      },
      animation: {
        'fade-in':      'fadeIn 0.35s cubic-bezier(0.16,1,0.3,1)',
        'slide-up':     'slideUp 0.4s cubic-bezier(0.16,1,0.3,1)',
        'slide-in':     'slideIn 0.4s cubic-bezier(0.16,1,0.3,1)',
        'bounce-in':    'bounceIn 0.5s cubic-bezier(0.36,0.07,0.19,0.97)',
        'scale-in':     'scaleIn 0.3s cubic-bezier(0.16,1,0.3,1)',
        'shimmer':      'shimmer 1.8s infinite linear',
        'float':        'float 3s ease-in-out infinite',
        'pulse-ring':   'pulseRing 1.5s ease-out infinite',
        'card-enter':   'cardEnter 0.5s cubic-bezier(0.16,1,0.3,1) both',
      },
      keyframes: {
        fadeIn:    { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideUp:   { from: { transform: 'translateY(100%)' }, to: { transform: 'translateY(0)' } },
        slideIn:   { from: { transform: 'translateX(100%)', opacity: '0' }, to: { transform: 'translateX(0)', opacity: '1' } },
        bounceIn:  { '0%': { transform: 'scale(0.85)', opacity: '0' }, '60%': { transform: 'scale(1.06)' }, '100%': { transform: 'scale(1)', opacity: '1' } },
        scaleIn:   { from: { transform: 'scale(0.92)', opacity: '0' }, to: { transform: 'scale(1)', opacity: '1' } },
        shimmer:   { from: { backgroundPosition: '-200% 0' }, to: { backgroundPosition: '200% 0' } },
        float:     { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
        pulseRing: { '0%': { transform: 'scale(1)', opacity: '0.8' }, '100%': { transform: 'scale(1.6)', opacity: '0' } },
        cardEnter: { from: { opacity: '0', transform: 'translateY(20px) scale(0.97)' }, to: { opacity: '1', transform: 'translateY(0) scale(1)' } },
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.16,1,0.3,1)',
      },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
}
