const withPlugins = require('next-compose-plugins')
const withImages = require('next-images')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withPlugins([
  withBundleAnalyzer,
  withImages,
], {
  poweredByHeader: false,
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_KRATOS_URL: 'https://login.socketkit.com',
    NEXT_PUBLIC_API_URL: 'https://core.socketkit.com/v1',
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
