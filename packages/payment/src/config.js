export default {
  isProduction: process.env.NODE_ENV === 'production',
  port: process.env.PORT ? parseInt(process.env.PORT) : 3005,
  stripe: {
    key: process.env.STRIPE_KEY,
    portal_return_url:
      process.env.STRIPE_PORTAL_RETURN_URL ??
      'https://web.socketkit.com/account/settings',
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
      process.env.flat_fee_based ?? 'price_1IhvnDEArFRUZZMzFFoIepCx',
  },
  knex: {
    client: 'pg',
    version: '13',
    connection: {
      database: 'payment',
      user: 'payment-worker',
    },
    pool: { min: 0, max: 5 },
  },
}
