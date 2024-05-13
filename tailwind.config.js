const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    colors: {
      ...colors,
      primary: "rgb(var(--hot-primary-rgb))",
      secondary: "rgb(var(--hot-secondary-rgb) / <alpha-value>)",
      info: "rgb(var(--hot-info-rgb) / <alpha-value>)",
      error: "rgb(var(--hot-error-rgb) / <alpha-value>)",
      warning: "rgb(var(--hot-warning-rgb) / <alpha-value>)",
      success: "rgb(var(--hot-success-rgb) / <alpha-value>)",
    },
  },
  purge: [
    "./src/components/**/*.js",
    "./src/components/**/*.jsx",
    "./playground/src/fixtures/*.jsx",
    "./src/components/HOTTheme/hot.css",
  ],
  variants: {},
  plugins: [],
  prefix: "hui-",
};
