const colors = require('tailwindcss/colors')
const theme = require('tailwindcss/defaultTheme')

module.exports = {
  purge: {
    mode: 'all',
    enabled: process.env.NODE_ENV === 'production',
    content: ['components', 'helpers', 'images', 'layouts', 'pages']
      .map((p) => ['js'].map((e) => `./${p}/**/*.${e}`))
      .flat(3)
      .concat(['./node_modules/nprogress/**/*.js', './node_modules/react-date-range/**/*.js']),
  },
  darkMode: false,
  theme: {
    extend: {
      boxShadow: {
        lgs: '0 5px 15px 5px rgba(0, 0, 0, 0.05)',
      },
      colors: {
        orange: colors.orange,
        warmGray: colors.warmGray,
        trueGray: colors.trueGray,
      },
      fontFamily: {
        sans: ['Inter var', ...theme.fontFamily.sans],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp'),
  ],
}
