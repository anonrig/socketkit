const colors = require('tailwindcss/colors')

module.exports = {
  purge: {
    mode: 'all',
    enabled: true,
    content: ['components', 'helpers', 'images', 'layouts', 'pages']
      .map(p => ['js', 'html'].map(e => `./${p}/**/*.${e}`))
      .flat(3)
      .concat([
        './node_modules/nprogress/**/*.js',
        './node_modules/react-date-range/**/*.js',
      ]),
  },
  darkMode: false,
  theme: {
    extend: {
      colors: {
        orange: colors.orange,
        blueGray: colors.blueGray,
        yellow: colors.yellow,
        lime: colors.lime,
        amber: colors.amber,
        red: colors.red,
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
