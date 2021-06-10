import { NextSeo } from 'next-seo'

import Component from 'components/integration-required.js'

export default function IntegrationRequired() {
  return (
    <>
      <NextSeo title="Application Integration Required" />

      <Component
        title="Application Integration Required"
        subtitle="You need to add an integration to access your Applications list."
        url="/products"
      />
    </>
  )
}
