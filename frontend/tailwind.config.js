/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "Geist Mono", "Fira Code", "monospace"],
      },
      colors: {
        // Accent
        accent: {
          DEFAULT: "#2563EB",
          hover: "#1D4ED8",
          muted: "#EFF6FF",
          "muted-dark": "#1E3A5F",
        },
        // Semantic
        success: {
          DEFAULT: "#16A34A",
          dark: "#22C55E",
        },
        warning: {
          DEFAULT: "#D97706",
          dark: "#F59E0B",
        },
        error: {
          DEFAULT: "#DC2626",
          dark: "#EF4444",
        },
      },
      fontSize: {
        "heading-xl": ["24px", { lineHeight: "1.3", fontWeight: "600" }],
        "heading-lg": ["20px", { lineHeight: "1.3", fontWeight: "600" }],
        "heading-md": ["16px", { lineHeight: "1.4", fontWeight: "600" }],
        "heading-sm": ["14px", { lineHeight: "1.4", fontWeight: "600" }],
        "body-lg": ["15px", { lineHeight: "1.6", fontWeight: "400" }],
        body: ["14px", { lineHeight: "1.6", fontWeight: "400" }],
        "body-sm": ["13px", { lineHeight: "1.5", fontWeight: "400" }],
        caption: ["12px", { lineHeight: "1.4", fontWeight: "400" }],
        label: ["12px", { lineHeight: "1.2", fontWeight: "500" }],
      },
      spacing: {
        1: "4px",
        2: "8px",
        3: "12px",
        4: "16px",
        5: "20px",
        6: "24px",
        8: "32px",
        10: "40px",
        12: "48px",
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "6px",
        md: "6px",
        lg: "8px",
        xl: "8px",
      },
      transitionDuration: {
        fast: "100ms",
        normal: "150ms",
        slow: "200ms",
      },
      transitionTimingFunction: {
        "ease-out": "ease-out",
        "ease-in-out": "ease-in-out",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.04)",
        DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.06), 0 2px 4px -2px rgb(0 0 0 / 0.04)",
      },
      width: {
        sidebar: "220px",
        "sidebar-collapsed": "56px",
      },
      minWidth: {
        app: "900px",
      },
      minHeight: {
        app: "600px",
      },
      maxWidth: {
        content: "860px",
      },
    },
  },
  plugins: [],
};
