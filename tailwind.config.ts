import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#070c16',
          900: '#0a1120',
          850: '#0d1830',
          800: '#111c31',
          700: '#162240',
        },
        cyan: { brand: '#38bdf8', bright: '#22d3ee' },
        violet: { brand: '#9d8bff' },
        ink: {
          primary:   '#e9eff8',
          secondary: '#9bafce',
          muted:     '#62769b',
        },
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'sans-serif'],
        ui:      ['"Hanken Grotesk"',     'sans-serif'],
        mono:    ['"JetBrains Mono"',      'monospace'],
      },
      backgroundImage: {
        'radial-fade': 'radial-gradient(ellipse at center, transparent 0%, black 70%)',
      },
      boxShadow: {
        'glow-cyan':  '0 0 20px rgba(56,189,248,0.25)',
        'glow-cyan-sm':'0 0 10px rgba(56,189,248,0.15)',
        'glow-violet':'0 0 20px rgba(157,139,255,0.25)',
        'card': '0 2px 16px rgba(0,0,0,0.4)',
      },
      keyframes: {
        'fade-up': { from:{opacity:'0',transform:'translateY(10px)'}, to:{opacity:'1',transform:'translateY(0)'} },
        'slide-left': { from:{opacity:'0',transform:'translateX(20px)'}, to:{opacity:'1',transform:'translateX(0)'} },
        'pulse-glow': { '0%,100%':{opacity:'1'}, '50%':{opacity:'0.6'} },
      },
      animation: {
        'fade-up':    'fade-up 0.3s ease-out forwards',
        'slide-left': 'slide-left 0.25s ease-out forwards',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
