/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brodo: {
          blue: '#043958',
          'blue-light': '#0a5a8a',
          'blue-lighter': '#1976a3',
          'blue-dark': '#022840',
          'blue-darker': '#011420',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Arial', 'sans-serif'],
        heading: ['var(--font-rexton)', 'Arial', 'Helvetica', 'sans-serif'],
        rexton: ['var(--font-rexton)', 'sans-serif'],
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        'card': '8px',
        'card-lg': '12px',
      },
      boxShadow: {
        'brodo': '0 2px 8px rgba(4, 57, 88, 0.08)',
        'brodo-lg': '0 4px 16px rgba(4, 57, 88, 0.12)',
      },
    },
  },
  plugins: [],
};
