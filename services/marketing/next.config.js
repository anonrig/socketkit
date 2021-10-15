module.exports = {
  poweredByHeader: false,
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_GA_ID: 'G-MP2KX3YPZZ',
    CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID || '',
    CONTENTFUL_DELIVERY_API: process.env.CONTENTFUL_DELIVERY_API || '',
    CONTENTFUL_PREVIEW_API: process.env.CONTENTFUL_PREVIEW_API || '',
  },
}
