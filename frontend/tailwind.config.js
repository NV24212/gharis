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
          background: '#0A0A0A', // Main background
          content: '#171717',    // Card/content area background
          border: '#262626',      // Subtle borders
          primary: '#F5F5F5',     // Primary text (off-white)
          secondary: '#A3A3A3',   // Secondary text (gray)
          accent: '#FFFFFF',      // Accent color (e.g., buttons)
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
