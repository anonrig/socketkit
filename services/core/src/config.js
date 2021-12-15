export default {
  grpc: {
    store: process.env.STORE_GRPC_URL ?? 'localhost:3003',
    subscription: process.env.SUBSCRIPTION_GRPC_URL ?? 'localhost:3001',
    tracking: process.env.TRACKING_GRPC_URL ?? 'localhost:4001',
  },
  grpc_options: {
    defaults: true,
    enums: String,
    keepCase: true,
    longs: String,
    oneofs: true,
  },
  isProduction: process.env.NODE_ENV === 'production',
  knex: {
    client: 'pg',
    connection: {
      database: 'core',
      user: 'core-worker',
    },
    version: '13',
  },
  kratos: {
    private: process.env.KRATOS_ADMIN_URL,
    public: process.env.KRATOS_PUBLIC_URL ?? 'https://login.socketkit.com',
  },
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
}
