const colors = require('tailwindcss/colors')
const theme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './components/**/*.jsx',
    './helpers/**/*.jsx',
    './layouts/*.jsx',
    './pages/**/*.jsx',
    './styles/*.css',
  ],
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp'),
  ],
  theme: {
    extend: {
      boxShadow: {
        lgs: '0 5px 15px 5px rgba(0, 0, 0, 0.05)',
      },
      colors: {
        neutral: colors.neutral,
        orange: colors.orange,
        stone: colors.stone,
      },
      fontFamily: {
        sans: ['Inter var', ...theme.fontFamily.sans],
      },
    },
  },
}
