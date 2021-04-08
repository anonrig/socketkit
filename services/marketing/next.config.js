const withPreact = require('next-plugin-preact')

module.exports = withPreact({
  poweredByHeader: false,
  reactStrictMode: true,
  i18n: {
    locales: ['en-US'],
    defaultLocale: 'en-US',
  },
  future: {
    webpack5: true,
    strictPostcssConfiguration: true,
  },
})
