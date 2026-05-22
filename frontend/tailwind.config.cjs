// tailwind.config.cjs
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "hsl(222, 73%, 45%)",
        secondary: "hsl(210, 40%, 20%)",
        accent: "hsl(45, 85%, 55%)"
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"]
      }
    }
  },
  plugins: []
};
