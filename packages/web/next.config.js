const withImages = require('next-images')

module.exports = withImages({
  poweredByHeader: false,
  reactStrictMode: true,
  env: {
    KRATOS_URL: 'https://login.socketkit.com',
    API_URL: 'https://core-dev.socketkit.com/v1',
    CURRENT_URL: 'https://web-dev.socketkit.com',
  },
})
