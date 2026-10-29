/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Red, Blue, White, Black theme core
        theme: {
          blue: {
            DEFAULT: "#2563eb",
            50: "#eff6ff",
            100: "#dbeafe",
            200: "#bfdbfe",
            300: "#93c5fd",
            400: "#60a5fa",
            500: "#3b82f6",
            600: "#2563eb",
            700: "#1d4ed8",
            800: "#1e40af",
            900: "#1e3a8a",
          },
          red: {
            DEFAULT: "#dc2626",
            50: "#fef2f2",
            100: "#fee2e2",
            200: "#fecaca",
            300: "#fca5a5",
            400: "#f87171",
            500: "#ef4444",
            600: "#dc2626",
            700: "#b91c1c",
            800: "#991b1b",
            900: "#7f1d1d",
          },
          black: {
            DEFAULT: "#09090b",
            pure: "#000000",
            card: "#121217",
            hover: "#1a1a22",
            border: "#272732",
          },
          white: {
            DEFAULT: "#ffffff",
            pure: "#ffffff",
            off: "#f8fafc",
            card: "#ffffff",
            border: "#e2e8f0",
          }
        },

        // Material/Compatibility aliases tuned to Red, Blue, White, Black
        "primary": "#2563eb",             // Royal Blue
        "primary-container": "#1d4ed8",
        "primary-fixed": "#dbeafe",
        "primary-fixed-dim": "#93c5fd",
        "on-primary": "#ffffff",
        "secondary": "#dc2626",           // Electric Crimson Red
        "secondary-container": "#ef4444",
        "on-secondary": "#ffffff",
        "tertiary": "#1e293b",
        "background": "#f8fafc",          // Crisp off-white in light mode
        "surface": "#ffffff",
        "surface-container": "#f1f5f9",
        "surface-container-low": "#f8fafc",
        "surface-container-high": "#e2e8f0",
        "surface-container-highest": "#cbd5e1",
        "on-surface": "#09090b",          // Deep Black text
        "on-surface-variant": "#475569",
        "inverse-surface": "#09090b",     // Deep Black in dark mode
        "inverse-on-surface": "#f8fafc",  // Pure White in dark mode
        "outline": "#64748b",
        "outline-variant": "#cbd5e1",
        "error": "#dc2626",
      },
      borderRadius: {
        "DEFAULT": "0.375rem",
        "lg": "0.75rem",
        "xl": "1rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
        "full": "9999px"
      },
      animation: {
        'fade-in': 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-down': 'slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'spin-slow': 'spin 12s linear infinite',
        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.04)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "sans-serif"],
      }
    },
  },
  plugins: [],
}
