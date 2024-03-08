/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,ts,js,svelte}'],
  theme: {
    extend: {
    colors: {
      "green": "#89A492",
      "grey": {
        100: "e3e3e3",
        200: "cfcfcf",
        300: "bfbfbf",
      },
      "white": "#FDFFFE",
      "red": "#dc8491",
      "blue": "#6090af",
      "p-green": "#529873",
      "p-yellow": "#f9d639",
      "p-purple": "#e8b5fd",
      "p-blue": "#39d6f9",
    },
    borderRadius: {
      "none": "0",
      DEFAULT: "5px",
      "lg": "84px",
    },
    },
    data: {
      isOpen: 'ui~="true"',
    },
  },
  plugins: [],
}
