const colors = require('tailwindcss/colors')

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
      colors: {
        orange: colors.orange,
      },
      gridTemplateColumns: {
        3: 'repeat(3, minmax(0, 1fr))',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
