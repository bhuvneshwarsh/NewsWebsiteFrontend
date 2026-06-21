/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans:  ['"Inter"', 'system-ui', 'sans-serif'],
      },
      typography: {
        gray: {
          css: {
            '--tw-prose-body':        '#374151',
            '--tw-prose-headings':    '#111827',
            '--tw-prose-links':       '#dc2626',
            '--tw-prose-bold':        '#111827',
            '--tw-prose-quotes':      '#6b7280',
            '--tw-prose-quote-borders': '#dc2626',
          }
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
  ]
}