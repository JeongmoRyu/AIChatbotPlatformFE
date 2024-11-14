import { line } from 'framer-motion/client';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        xxl: '1800px',
      },
      colors: {
        primary: {
          DEFAULT: '#1A68B2', // Primary 기본 색상
          dark: '#0C519B', // Primary Dark 색상
        },
        secondary: {
          DEFAULT: '#444444', // Secondary 기본 색상
          dark: '#222222', // Secondary Dark 색상
        },
        black: '#111111',
        background: '#F3F5F6',
        gray: {
          light: '#C5CDD6',
          dark: '#7B8188',
        },
        fill: {
          DEFAULT: '#F3F5F6',
        },
        line: {
          DEFAULT: '#DDDDDD',
        },
      },
      fontFamily: {
        pretendard: ['Pretendard Variable', 'sans-serif'], // Pretendard Variable 폰트 설정
      },
      fontSize: {
        sm: ['.875rem', { fontWeight: '400' }], // Small Regular
        base: ['1rem', { fontWeight: '400' }], // Base Regular
        lg: ['1.25rem', { fontWeight: '400' }], // Large Regular
        lgBold: ['1.25rem', { fontWeight: '700' }], // Large Bold
        xlBold: ['1.5rem', { fontWeight: '700' }], // Extra Large Bold
        xxlExtraBold: ['3.75rem', { fontWeight: '800' }], // 2XL Extra Bold
      },
      backgroundImage: (theme) => ({
        'gradient-point1': `linear-gradient(to right, ${theme('colors.primary.DEFAULT')}, ${theme('colors.gray.light')})`, // Point 1 그라데이션 정의
        'gradient-point2': `linear-gradient(to right, ${theme('colors.black')}, ${theme('colors.primary.DEFAULT')})`, // Point 2 그라데이션 정의
      }),
      maxWidth: {
        default: '45.25rem', // Default 최대 너비,
        xl: '61.25rem',
        xxl: '75rem',
      },
    },
  },
  plugins: [],
};
