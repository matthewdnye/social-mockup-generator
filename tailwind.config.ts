import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Twitter/X colors
        twitter: {
          blue: '#1d9bf0',
          black: '#0f1419',
          dark: '#16181c',
          darker: '#000000',
          gray: '#536471',
          lightGray: '#eff3f4',
          border: '#2f3336',
        },
        // LinkedIn colors
        linkedin: {
          blue: '#0a66c2',
          black: '#000000',
          gray: '#666666',
          lightGray: '#f3f2ef',
          border: '#e0e0e0',
        },
        // Facebook colors
        facebook: {
          blue: '#1877f2',
          black: '#050505',
          gray: '#65676b',
          lightGray: '#f0f2f5',
          border: '#dddfe2',
        },
        // Instagram colors
        instagram: {
          black: '#262626',
          gray: '#8e8e8e',
          lightGray: '#fafafa',
          border: '#dbdbdb',
        },
        // Threads colors
        threads: {
          black: '#000000',
          white: '#ffffff',
          gray: '#999999',
          border: '#3d3d3d',
        },
      },
      fontFamily: {
        twitter: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        linkedin: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        facebook: ['Segoe UI Historic', 'Segoe UI', 'Helvetica', 'Arial', 'sans-serif'],
        instagram: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        threads: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
