const colors = require('tailwindcss/colors')
const theme = require('tailwindcss/defaultTheme')

module.exports = {
  darkMode: false,
  mode: 'jit',
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp'),
  ],
  purge: [
    './components/**/*.jsx',
    './helpers/**/*.jsx',
    './layouts/*.jsx',
    './pages/**/*.jsx',
    './styles/*.css',
  ],
  theme: {
    extend: {
      boxShadow: {
        lgs: '0 5px 15px 5px rgba(0, 0, 0, 0.05)',
      },
      colors: {
        orange: colors.orange,
        trueGray: colors.trueGray,
        warmGray: colors.warmGray,
      },
      fontFamily: {
        sans: ['Inter var', ...theme.fontFamily.sans],
      },
    },
  },
}
