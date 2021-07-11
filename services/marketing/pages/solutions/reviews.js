import { BreadcrumbJsonLd, NextSeo } from 'next-seo'
import Image from 'next/image'
import Layout from 'components/layout.js'

export default function Reviews() {
  return (
    <Layout>
      <NextSeo
        title={'AppStore Review Tracking & Management'}
        description={`Easily used cross-platform user behavior analysis for growing teams and businesses. Built specifically for businesses who wants to be privacy and security compliant.`}
      />

      <BreadcrumbJsonLd
        itemListElements={[
          {
            position: 1,
            name: 'Reviewclasss',
            item: 'https://socketkit.com/solutions/reviews',
          },
        ]}
      />

      <div className="relative overflow-hidden">
        <div className="relative pt-6 pb-16 sm:pb-24">
          <div className="mt-16 mx-auto max-w-7xl px-4 sm:mt-24 sm:px-6">
            <div className="text-center">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Real-time review tracking</span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                Socketkit provides real-time tracking and search on AppStore and PlayStore
                application reviews with country, application and version filtering.
              </p>
            </div>
          </div>
        </div>
        <div className="relative pb-8 sm:pb-12 md:pb-18 lg:pb-24">
          <div className="absolute inset-0 flex flex-col" aria-hidden="true">
            <div className="flex-1"></div>
            <div className="flex-1 w-full bg-warmGray-100"></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="relative rounded-lg shadow-lg">
              <Image
                src="/assets/landing-reviews.png"
                alt="Real-time review tracking for AppStore & Playstore"
                width={800}
                height={488}
                layout="responsive"
                unoptimized={process.env.NODE_ENV === 'development'}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
