/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      letterSpacing: {
        tighterneg: "-0.05em",
      },
      boxShadow: {
        "inner-md": "inset 0 2px 6px rgba(0, 0, 0, 0.1)",
        "inner-soft": "inset 0 1px 2px rgba(0,0,0,0.05)",
        outline: "0 0 0 3px rgba(66, 153, 225, 0.5)",
        "strong-drop": "0 8px 20px rgba(0, 0, 0, 0.2)",
      },
      keyframes: {
        "scale-fade": {
          "0%": {
            opacity: "0",
            transform: "scale(0.95)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1)",
          },
        },
      },
      animation: {
        "pop-in": "scale-fade 300ms ease-out",
      },
      colors: {
        brand: "#000000",
      },
      fontFamily: {
        geist: ["Geist", "sans-serif"],
      },
    },
  },
  plugins: [],
};
