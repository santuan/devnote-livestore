import containerQueries from '@tailwindcss/container-queries'
import typography from '@tailwindcss/typography'
import scrollbar from 'tailwind-scrollbar'
import animate from 'tailwindcss-animate'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        xl: 'calc(var(--radius) + 4px)',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--reka-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--reka-accordion-content-height)' },
          to: { height: 0 },
        },
        'collapsible-down': {
          from: { height: 0 },
          to: { height: 'var(--reka-collapsible-content-height)' },
        },
        'collapsible-up': {
          from: { height: 'var(--reka-collapsible-content-height)' },
          to: { height: 0 },
        },
        'slideDownAndFade': {
          from: { opacity: 0, transform: 'translateY(-6px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        'slideLeftAndFade': {
          from: { opacity: 0, transform: 'translateX(6px)' },
          to: { opacity: 1, transform: 'translateX(0)' },
        },
        'slideUpAndFade': {
          from: { opacity: 0, transform: 'translateY(6px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        'slideRightAndFade': {
          from: { opacity: 0, transform: 'translateX(-6px)' },
          to: { opacity: 1, transform: 'translateX(0)' },
        },
        'overlayShow': {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        'contentShow': {
          from: { opacity: 0, transform: 'translate(-50%, -50%) scale(0.96)' },
          to: { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
        },
        'hide': {
          from: { opacity: 1 },
          to: { opacity: 0 },
        },
        'slideIn': {
          from: { transform: 'translateX(calc(100% + var(--viewport-padding)))' },
          to: { transform: 'translateX(0)' },
        },
        'swipeOut': {
          from: { transform: 'translateX(var(--reka-toast-swipe-end-x))' },
          to: { transform: 'translateX(calc(100% + var(--viewport-padding)))' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'collapsible-down': 'collapsible-down 0.2s ease-in-out',
        'collapsible-up': 'collapsible-up 0.2s ease-in-out',
        'slideDownAndFade': 'slideDownAndFade 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        'slideLeftAndFade': 'slideLeftAndFade 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        'slideUpAndFade': 'slideUpAndFade 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        'slideRightAndFade': 'slideRightAndFade 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        'overlayShow': 'overlayShow 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        'contentShow': 'contentShow 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        'hide': 'hide 0.1s ease-in',
        'slideIn': 'slideIn 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
        'swipeOut': 'swipeOut 0.1s ease-out',
      },
    },
    fontFamily: {
      mono: ['JetBrains Mono Variable', 'monospace'],
      serif: ['IBM Plex Serif', 'serif'],
    },
  },
  plugins: [
    typography,
    animate,
    containerQueries,
    scrollbar,
  ],
}
