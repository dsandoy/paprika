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
        },
          fade_in_right: {
            "0%": {
              transform: "translateX(-100%)",
              opacity: "0",
            },
            "100%": {
              transform: "translateX(0)",
              opacity: "1",
            },
          },
      },
      animation: {
        wiggle: 'confetti 1s ease-in-out infinite',
        sparkle: 'sparkle 0.35s ease-in-out',
        fade_in_right: 'fade_in_right 0.25s forwards'
      }
    },
    data: {
      isOpen: 'ui~="true"',
    },

  },
  daisyui : {
    themes: [{
      light: {
        "primary": "#457B9D",
        "secondary": "#B9CABF",
        "accent": "#dc8491",
        "neutral": "#CF5C36",
        "base-300": "#e3e3e3",
        "base-200": "#ffffff",
        "base-100": "#f3f6f4",
        "info": "#457B9D",
        "success": "#529873",
        "warning": "#f9d639",
        "error": "#ff0000",
        },
    },
    {
    dark:  {
      "primary": "#f3f6f4",
      "secondary": "#6E7C73",
      "accent": "#dc8491",
      "neutral": "#426B6F",
      "base-300": "#3B4C49",
      "base-200": "#2F3E3B",
      "base-100": "#232e27",
      "info": "#6090af",
      "success": "#529873",
      "warning": "#f9d639",
       "error": "#ff0000",
      },
    },
    {
      tree:    {
        "primary": "#896978",
        "secondary": "#394053",
        "accent": "#723D46",
        "neutral": "#BFC4AC",
        "base-100": "#Dad7cd",
        "base-200": "#F2E9E4",
        "base-300":"#cbc7b9",
        "info": "#69585F",
        "success": "#588157",
        "warning": "#A3B18A",
        "error": "#ff0000",
      }
    },

  ],
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("daisyui"),
  ],
  darkTheme: 'dark',
}
