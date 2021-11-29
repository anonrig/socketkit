import Component from 'components/integration-required'
import { NextSeo } from 'next-seo'

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
