/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/app/**/*.{js,ts,jsx,tsx}",
      "./src/pages/**/*.{js,ts,jsx,tsx}",
      "./src/components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          sans: ["var(--font-geist-sans)"],
          mono: ["var(--font-geist-mono)"],
        },
        colors: {
          background: "var(--background)",
          foreground: "var(--foreground)",
          accent: "var(--accent-color)",
          card: "var(--card-bg)",
          'card-hover': "var(--card-hover)",
        },
        container: {
          center: true,
          padding: {
            DEFAULT: '1rem',
            sm: '2rem',
            lg: '4rem',
            xl: '5rem',
          },
        },
      },
    },
    plugins: [],
  }