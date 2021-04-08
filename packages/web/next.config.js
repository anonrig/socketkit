const withPlugins = require('next-compose-plugins')
const withImages = require('next-images')

module.exports = withPlugins([withImages], {
  poweredByHeader: false,
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_KRATOS_URL: 'https://login.socketkit.com',
    NEXT_PUBLIC_API_URL: 'https://core.socketkit.com/v1',
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /react-spring/,
      sideEffects: true,
    })
    return config
  },
  async redirects() {
    return [
      {
        source: '/reports',
        destination: '/reports/mrr',
        permanent: false,
      },
    ]
  },
  future: { webpack5: true, strictPostcssConfiguration: true },
})
