const { withSentryConfig } = require('@sentry/nextjs')

module.exports = withSentryConfig(
  {
    poweredByHeader: false,
    reactStrictMode: true,
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
          destination: '/reports/revenue',
          permanent: false,
        },
      ]
    },
  },
  {},
)
