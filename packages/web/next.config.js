const withImages = require('next-images')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
module.exports = withBundleAnalyzer(withImages({
  poweredByHeader: false,
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_KRATOS_URL: 'https://login.socketkit.com',
    NEXT_PUBLIC_API_URL: 'https://core.socketkit.com/v1',
    NEXT_PUBLIC_CURRENT_URL: 'https://web.socketkit.com',
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.node = {
        fs: 'empty'
      }
    }
    return config
  }
}))