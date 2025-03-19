/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          main: colors.slate[700],
          text: colors.white,
          light: colors.slate[600],
          selected: colors.orange[500],
        },
        secondary: {
          main: colors.orange[500],
          text: colors.white,
        },
        link: {
          hover: colors.gray[300],
        },
        nav: {
          hover: colors.gray[700],
        },
        background: {
          default: "#999999",
          paper: "#dddddd",
          hover: "rgba(255, 255, 255, 0.08)",
          overlay: "#2b2b2b",
        },
        rarity: {
          ssr: "#de9e01",
          sr: "#7967ba",
          r: "#45b6fe",
        },
        info: "#6979d9",
      },
    },
  },
  plugins: [],
};
