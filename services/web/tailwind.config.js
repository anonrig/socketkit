const colors = require('tailwindcss/colors')
const theme = require('tailwindcss/defaultTheme')

module.exports = {
  mode: 'jit',
  purge: [
    './components/**/*.js',
    './helpers/**/*.js',
    './layouts/*.js',
    './pages/**/*.js',
    './styles/*.css',
  ],
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
