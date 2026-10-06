/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./js/*.{js,jsx}",
    "./js/components/**/*.{js,jsx}",
    "./js/pages/**/*.{js,jsx}",
    "./js/context/**/*.{js,jsx}",
    "./js/data/**/*.{js,jsx}",
    "./js/bundle.js"
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      screens: {
        'xs': '480px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px'
      },
      fontFamily: {
        sans: ['"Book Antiqua"', 'Palatino', '"Palatino Linotype"', '"URW Bookman L"', '"Noto Serif Tamil"', 'Georgia', 'serif'],
        heading: ['"Book Antiqua"', 'Palatino', '"Palatino Linotype"', '"URW Bookman L"', '"Noto Serif Tamil"', 'Georgia', 'serif'],
        display: ['"Book Antiqua"', 'Palatino', '"Palatino Linotype"', '"URW Bookman L"', '"Noto Serif Tamil"', 'Georgia', 'serif'],
        serif: ['"Book Antiqua"', 'Palatino', '"Palatino Linotype"', '"URW Bookman L"', '"Noto Serif Tamil"', 'Georgia', 'serif'],
        num: ['"Book Antiqua"', 'Palatino', '"Palatino Linotype"', '"URW Bookman L"', '"Noto Serif Tamil"', 'Georgia', 'serif'],
        mono: ['"Book Antiqua"', 'Palatino', '"Palatino Linotype"', '"URW Bookman L"', '"Noto Serif Tamil"', 'Georgia', 'serif']
      },
      colors: {
        page: '#ffffff',
        section: '#ffffff',
        borderTint: '#e2e8df',
        navy: {
          800: '#1E293B',
          900: '#0F172A',
        },
        blue: {
          50: '#EFF6FF',
          600: '#2563EB',
        },
        green: {
          50: '#F0FDF4',
          600: '#16A34A',
        },
        red: {
          600: '#DC2626',
        },
        amber: {
          400: '#FBBF24',
        },
        cream: {
          50: '#FBF7EF',
        },
        gray: {
          50: '#f8faf4',
          100: '#f8faf4',
          200: '#e2e8df',
          500: '#475569',
        },
        obsidian: '#020617',
        charcoal: '#0b0f19',
        brandBlue: {
          DEFAULT: '#2563EB',
          50: '#EFF6FF',
          400: '#60a5fa',
          500: '#2563EB',
          600: '#1d4ed8',
          700: '#1e40af',
        },
        brandGreen: {
          DEFAULT: '#16A34A',
          50: '#F0FDF4',
          400: '#4ade80',
          500: '#16A34A',
          600: '#15803d',
          700: '#166534',
        }
      }
    }
  },
  plugins: []
};
