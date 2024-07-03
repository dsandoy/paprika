/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,ts,js,svelte}'],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Noto', 'sans-serif'],
        'libre': ['Libre', 'sans-serif'],
      },
      colors: {
        "green": {
          50: "#F3F6F4",
          DEFAULT: "#89A492",
        },
        "grey": {
          100: "#e3e3e3",
          200: "#cfcfcf",
          300: "#bfbfbf",
        },
        "white": "#FDFFFE",
        "red": "#dc8491",
        "nice-blue": "#6090af",
        "p-green": "#529873",
        "p-yellow": "#f9d639",
        "p-purple": "#e8b5fd",
        "p-blue": "#39d6f9",
      },
      borderRadius: {
        "sm": "5px",
        "none": "0",
        DEFAULT: "1rem",
        "lg": "84px",
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        sparkle: {
          "0%": {
            opacity: "0.6",
            transform: "scale(0.8) ",

          },
          "100%": {
            opacity: "1",
            transform: "scale(1)",
          }
        }
      },
      animation: {
        wiggle: 'confetti 1s ease-in-out infinite',
        sparkle: 'sparkle 0.35s ease-in-out'
      }
    },
    data: {
      isOpen: 'ui~="true"',
    },

  },
  daisyui : {
    themes: [{
      light: {
        "primary": "#627F6B",
        "secondary": "#839D9A",
        "accent": "#dc8491",
        "neutral": "#003844",
        "base-300": "#e3e3e3",
        "base-200": "#ffffff",
        "base-100": "#f4f4f4",
        "info": "#6090af",
        "success": "#529873",
        "warning": "#f9d639",
        "error": "#ff0000",
        },
    },
    {
    dark:  {
      "primary": "#3F5747",
      "secondary": "#839D9A",
      "accent": "#dc8491",
      "neutral": "#426B6F",
      "base-300": "#3B4C49",
      "base-200": "#2F3E3B",
      "base-100": "#22302d",
      "info": "#6090af",
      "success": "#529873",
      "warning": "#f9d639",
       "error": "#ff0000",
      },
    }
  ],
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("daisyui"),
  ],
  darkTheme: 'dark',
}
