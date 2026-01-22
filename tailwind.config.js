/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#3b82f6",
          "secondary": "#8b5cf6",
          "accent": "#10b981",
          "neutral": "#1f2937",
          "base-100": "#ffffff",
          "base-200": "#f3f4f6",
          "base-300": "#e5e7eb",
          "info": "#06b6d4",
          "success": "#10b981",
          "warning": "#f59e0b",
          "error": "#ef4444",
        },
        dark: {
          "primary": "#3b82f6",
          "secondary": "#8b5cf6",
          "accent": "#10b981",
          "neutral": "#1f2937",
          "base-100": "#0f172a",
          "base-200": "#1e293b",
          "base-300": "#334155",
          "info": "#06b6d4",
          "success": "#10b981",
          "warning": "#f59e0b",
          "error": "#ef4444",
        },
      },
    ],
  },
}
