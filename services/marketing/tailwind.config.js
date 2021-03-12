const colors = require('tailwindcss/colors')

module.exports = {
  purge: {
    mode: 'all',
    enabled: process.env.NODE_ENV === 'production',
    content: ['components', 'helpers', 'images', 'layouts', 'pages']
      .map((p) => ['js'].map((e) => `./${p}/**/*.${e}`))
      .flat(3)
  },
  darkMode: false,
  theme: {
    extend: {
      colors: {
        orange: colors.orange,
        warmGray: colors.warmGray,
        trueGray: colors.trueGray,
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
