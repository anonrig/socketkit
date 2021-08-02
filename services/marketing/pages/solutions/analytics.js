import { BreadcrumbJsonLd, NextSeo } from 'next-seo'
import Layout from 'components/layout.js'

export default function Analytics() {
  return (
    <Layout>
      <NextSeo
        title={'Mobile-first In-App Purchase & Subscription Management'}
        description={`Cross-platform user analytics for growing teams and businesses. Built specifically for businesses who wants to be privacy and security compliant.`}
        twitter={{
          cardType: 'summary_large_image',
        }}
        openGraph={{
          title: 'In-App Purchase & Subscription Management',
          images: [
            {
              url: '/twitter/user-analytics.png',
              width: 900,
              height: 450,
              alt: 'Privacy-first Analytics for mobile',
            },
          ],
        }}
      />

      <BreadcrumbJsonLd
        itemListElements={[
          {
            position: 1,
            name: 'Analytics',
            item: 'https://socketkit.com/solutions/analytics',
          },
        ]}
      />

      <div className="bg-white pb-8 sm:pb-12 lg:pb-12">
        <div className="pt-8 overflow-hidden sm:pt-12 lg:relative lg:py-24">
          <div className="mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:px-8 lg:max-w-7xl lg:grid lg:grid-cols-2 lg:gap-24">
            <div>
              <div className="my-24">
                <div className="mt-12 sm:max-w-xl">
                  <div className="mb-4">
                    <span className="rounded bg-trueGray-50 px-2.5 py-1 text-xs font-semibold text-orange-500 tracking-wide uppercase">
                      Coming Soon
                    </span>
                  </div>
                  <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
                    Mobile Analytics
                  </h1>
                  <p className="mt-6 text-xl text-warmGray-900 font-semibold">
                    Secure behavior analysis with built-in fraud prevention.
                  </p>
                  <p className="mt-6 text-xl text-gray-500">
                    Easily used cross-platform user behavior analysis for growing teams and
                    businesses. Built specifically for businesses who wants to be privacy and
                    security compliant.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="sm:mx-auto sm:max-w-3xl sm:px-6">
            <div className="py-12 sm:relative sm:mt-12 sm:py-16 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
              <div className="relative pl-4 -mr-40 sm:mx-auto sm:max-w-3xl sm:px-0 lg:max-w-none lg:h-full lg:pl-12">
                <img
                  className="w-full rounded-md shadow-xl ring-1 ring-black ring-opacity-5 lg:h-full lg:w-auto lg:max-w-none"
                  src="/assets/solutions-analytics-hero.jpg"
                  alt="Event Tracking & Analysis for Mobile Applications"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
