export default {
  isProduction: process.env.NODE_ENV === 'production',
  port: process.env.PORT ? parseInt(process.env.PORT) : 3005,
  sentry_dsn: process.env.SENTRY_DSN,
  stripe: {
    key: process.env.STRIPE_KEY,
    signing_key:
      process.env.STRIPE_SIGNING_KEY ??
      'whsec_FJ74x22xcIJkEcBEWN01URUCc9wY5wd0',
    portal_return_url:
      process.env.STRIPE_PORTAL_RETURN_URL ??
      'https://web.socketkit.com/account',
    checkout_success_url:
      process.env.STRIPE_CHECKOUT_SUCCESS_URL ??
      'https://web.socketkit.com/?payment=success',
    checkout_cancel_url:
      process.env.STRIPE_CHECKOUT_CANCEL_URL ??
      'https://web.socketkit.com/?payment=failure',
  },
  products: {
    usage_based:
      process.env.USAGE_BASED_PRODUCT ?? 'price_1IhvnDEArFRUZZMzAfo3P7Lr',
    flat_fee_based:
      process.env.FLAT_BASED_PRODUCT ?? 'price_1IhvnDEArFRUZZMzFFoIepCx',
  },
  subscription: {
    special_user_key:
      process.env.SUBSCRIPTION_SPECIAL_USER_KEY ?? 'sub_special_user',
  },
  knex: {
    client: 'pg',
    version: '13',
    connection: {
      database: 'payment',
      user: 'payment-worker',
    },
  },
}
