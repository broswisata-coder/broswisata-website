/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./id/**/*.html",
    "./ms/**/*.html",
    "./en/**/*.html",
    "./paket-*.html"
  ],
  theme: {
    extend: {
      colors: {
        'bros-blue': '#0F47B0',
        'bros-navy': '#0A2E70',
        'bros-gold': '#E8A317',
        'bros-cream': '#FAF7F2',
        'bros-charcoal': '#1F2937',
      },
      fontFamily: {
        'display': ['Bricolage Grotesque', 'sans-serif'],
        'body': ['Plus Jakarta Sans', 'sans-serif'],
        'sans': ['Plus Jakarta Sans', 'sans-serif'],
      },
    }
  },
  plugins: []
}
