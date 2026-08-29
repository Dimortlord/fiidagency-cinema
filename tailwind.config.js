/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        night: "#1B1033",
        paper: "#FFF7EC",
        red: "#D0062F",
        amber: "#FFB03A",
        mint: "#7BC5C0",
        rose: "#F2A0A8",
      },
    },
  },
  plugins: [],
};
