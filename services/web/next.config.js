module.exports = {
  env: {
    API_URL: process.env.API_URL,
    CURRENT_URL: process.env.CURRENT_URL,
    KRATOS_URL: process.env.KRATOS_URL,
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
  },
  poweredByHeader: false,
  reactStrictMode: true,
  async redirects() {
    return [
      {
        destination: '/reports/revenue',
        permanent: false,
        source: '/reports',
      },
    ]
  },
}
