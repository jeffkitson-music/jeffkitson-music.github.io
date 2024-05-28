/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      screens: {
        "1100px": "1100px",
        "571px": "571px",
      },
    },
  },
  plugins: [],
};
