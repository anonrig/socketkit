export default {
  isProduction: process.env.NODE_ENV === 'production',
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  grpc: {
    subscription: process.env.SUBSCRIPTION_GRPC_URL ?? 'localhost:3001',
    store: process.env.STORE_GRPC_URL ?? 'localhost:3003',
  },
  kratos: {
    private: process.env.KRATOS_ADMIN_URL,
    public: process.env.KRATOS_PUBLIC_URL ?? 'https://login.socketkit.com',
  },
}
