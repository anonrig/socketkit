import { NextSeo } from 'next-seo'
import Heading from 'components/heading'

const breadcrumb = [
  { title: 'Products & Integrations', href: '/products' },
  { title: 'Application Tracking', href: '/products/application-tracking' },
]

function TrackingApplications() {
  return (
    <>
      <NextSeo title="Application Tracking" />
      <Heading steps={breadcrumb}>Application Tracking</Heading>
    </>
  )
}

export default TrackingApplications
