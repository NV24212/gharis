/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        arabic: ["PNU", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          background: "#1a1a1a",
          gray: "#6e6c6f",
          white: "#ffffff",
          black: "#000000",
          primary: "#a3885f",
          primary: "#ffffff",
          secondary: "#a0a0a0",
          border: "rgba(255, 255, 255, 0.1)",
        },
      },
      borderRadius: {
        20: "20px",
      },
      boxShadow: {
        card: "0 8px 24px rgba(0,0,0,0.4)",
        insetSoft: "inset 0 0 0 1px rgba(255,255,255,0.06)",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: 0, transform: "translateY(12px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        "fade-in-up": "fadeInUp 600ms ease-out forwards",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
