/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        mall: {
          void: "#0a0a12",
          panel: "#12121e",
          panel2: "#191926",
          border: "#2a2a3d",
          text: "#e8e8f0",
          muted: "#8b8ba3",
          glow: "#7c5cff",
          glow2: "#22d3ee",
        },
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(124, 92, 255, 0.5)",
      },
    },
  },
  plugins: [],
};
