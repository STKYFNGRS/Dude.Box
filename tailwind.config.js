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
          sans: ["var(--font-sans)"],
          serif: ["var(--font-serif)"],
        },
        colors: {
          background: "var(--color-background)",
          foreground: "var(--color-foreground)",
          muted: "var(--color-muted)",
          accent: "var(--color-accent)",
          border: "var(--color-border)",
          panel: "var(--color-panel)",
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