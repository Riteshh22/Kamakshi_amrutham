import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand: deep maroon/burgundy
        brand: {
          50:  '#fdf2f3',
          100: '#fbe6e8',
          200: '#f5c9ce',
          300: '#eda0a9',
          400: '#e16d7c',
          500: '#c94156',
          600: '#8B1A2A',   // core maroon
          700: '#731524',
          800: '#5e111d',
          900: '#4e0f1a',
          950: '#2d060f',
        },
        // Muted gold / turmeric accent
        gold: {
          50:  '#fefbf0',
          100: '#fdf5d9',
          200: '#fae8a6',
          300: '#f5d56a',
          400: '#efbb34',
          500: '#C9952A',   // core gold
          600: '#a87520',
          700: '#8a5c18',
          800: '#6e4814',
          900: '#543811',
        },
        // Forest green accent
        forest: {
          50:  '#f0f7f0',
          100: '#d9ecd9',
          200: '#aed4ae',
          300: '#7ab57a',
          400: '#4f964f',
          500: '#2E7D32',   // core green
          600: '#266629',
          700: '#1e5121',
          800: '#173e19',
          900: '#112e13',
        },
        // Warm cream background
        cream: {
          50:  '#FFFDF8',
          100: '#FFF9EE',
          200: '#FFF3DC',
          300: '#FFE9C4',
          400: '#FDDAA3',
        },
        // Saffron - kept for compatibility
        saffron: {
          50:  '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        devanagari: ['Noto Serif Telugu', 'serif'],
      },
      boxShadow: {
        'warm': '0 4px 24px 0 rgba(139,26,42,0.10)',
        'warm-lg': '0 8px 40px 0 rgba(139,26,42,0.15)',
        'gold': '0 4px 20px 0 rgba(201,149,42,0.18)',
      },
    },
  },
  plugins: [],
};
export default config;
