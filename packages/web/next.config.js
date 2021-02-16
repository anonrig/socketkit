const withImages = require('next-images')

module.exports = withImages({
  poweredByHeader: false,
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_KRATOS_URL: 'https://login.socketkit.com',
    NEXT_PUBLIC_API_URL: 'https://core-dev.socketkit.com/v1',
    NEXT_PUBLIC_CURRENT_URL: 'https://web-dev.socketkit.com',
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.node = {
        fs: 'empty'
      }
    }
    return config
  }
})
