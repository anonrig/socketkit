module.exports = {
  poweredByHeader: false,
  reactStrictMode: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /react-spring/,
      sideEffects: true,
    })
    return config
  },
  env: {
    KRATOS_URL: process.env.KRATOS_URL,
    API_URL: process.env.API_URL,
    CURRENT_URL: process.env.CURRENT_URL,
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
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
}
