import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'fashion-primary': '#C21A27',
        'fashion-dark': '#000000',
        'fashion-beige': '#EDE8E2',
      },
    },
  },
  plugins: [],
};

export default config;
