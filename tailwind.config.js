/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/app/**/*.{js,ts,jsx,tsx}",
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
          accentSecondary: "var(--color-accent-secondary)",
          border: "var(--color-border)",
          panel: "var(--color-panel)",
          success: "var(--color-success)",
          error: "var(--color-error)",
          warning: "var(--color-warning)",
          info: "var(--color-info)",
          hover: "var(--color-hover)",
          active: "var(--color-active)",
        },
        boxShadow: {
          'glow': '0 0 20px rgba(199, 157, 122, 0.15)',
          'glow-lg': '0 0 40px rgba(199, 157, 122, 0.2)',
          'card': '0 4px 12px rgba(0, 0, 0, 0.2)',
          'card-hover': '0 8px 24px rgba(0, 0, 0, 0.3)',
          'button': '0 4px 12px rgba(199, 157, 122, 0.3)',
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
        animation: {
          'fade-in': 'fadeIn 0.4s ease-out',
          'slide-in-right': 'slideInRight 0.3s ease-out',
          'slide-in-left': 'slideInLeft 0.3s ease-out',
        },
      },
    },
    plugins: [],
  }