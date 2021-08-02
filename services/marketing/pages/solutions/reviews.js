import { BreadcrumbJsonLd, NextSeo } from 'next-seo'
import Image from 'next/image'
import Layout from 'components/layout.js'

import { SupportIcon, ChartBarIcon, TrendingUpIcon, CheckIcon } from '@heroicons/react/outline'

const features = [
  {
    name: 'Invite team members',
    description: 'Give access to your support team for better targeting.',
  },
  {
    name: 'Filters',
    description: 'Filter through thousands of reviews to understand where you did wrong.',
  },
  {
    name: 'Instant Search',
    description: 'Search your reviews just like you search on your favorite search engine.',
  },
  { name: 'Notifications', description: 'Get instant notifications for certain triggers.' },
  {
    name: 'Reporting',
    description: 'Find what you need with advanced filters, bulk actions, and quick views.',
  },
  {
    name: 'Insights',
    description:
      'Understand your general performance and identify potential issues on different countries.',
  },
  {
    name: 'Recommendations',
    description: 'Access recommendations before your revenue gets affected.',
  },
  {
    name: 'Mobile app',
    description: 'Get push notifications on Socketkit mobile application. Currently in alpha.',
  },
]

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
                <span className="block">Real-time app review tracking</span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                Socketkit provides real-time tracking and search on AppStore and PlayStore
                application reviews with country, application and version filtering.
              </p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="relative rounded-lg shadow-lg my-6">
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

      <div className="relative bg-white pt-16 sm:pt-24 lg:pt-28 mb-14">
        <div className="mx-auto max-w-md px-4 text-center sm:max-w-3xl sm:px-6 lg:px-8 lg:max-w-7xl">
          <p className="mt-2 text-3xl font-extrabold text-warmGray-900 tracking-tight sm:text-4xl">
            Monitor your app and business reviews
          </p>
          <p className="mt-5 max-w-prose mx-auto text-xl text-trueGray-500">
            Real-time review tracking helps you to protect your brand and your revenue. Easily get
            reviews on Slack, email, discord.
          </p>
          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="pt-6">
                <div className="flow-root bg-warmGray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-md shadow-lg bg-white">
                        <SupportIcon className="h-6 w-6 text-orange-500" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-semibold text-warmGray-900 tracking-tight">
                      Platform Support
                    </h3>
                    <p className="mt-5 text-base text-trueGray-500">
                      Track reviews on all major platforms including Slack, Discord and email.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-warmGray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-md shadow-lg bg-white">
                        <ChartBarIcon className="h-6 w-6 text-orange-500" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-semibold text-warmGray-900 tracking-tight">
                      Leverage your existing tools
                    </h3>
                    <p className="mt-5 text-base text-trueGray-500">
                      No need to visit both AppStore and PlayStore to track your application reviews
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-warmGray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-md shadow-lg bg-white">
                        <TrendingUpIcon className="h-6 w-6 text-orange-500" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-semibold text-warmGray-900 tracking-tight">
                      Convert to Leads
                    </h3>
                    <p className="mt-5 text-base text-trueGray-500">
                      Understand the issues and connect with your customers with better support
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8 lg:grid lg:grid-cols-3 lg:gap-x-8">
        <div>
          <h2 className="text-base font-bold text-orange-500 uppercase tracking-wide">
            Everything you need
          </h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900">All-in-one platform</p>
          <p className="mt-4 text-lg text-gray-500">
            All the features you need to increase your revenue by understanding your customers needs
            and feedback.
          </p>
        </div>
        <div className="mt-12 lg:mt-0 lg:col-span-2">
          <dl className="space-y-10 sm:space-y-0 sm:grid sm:grid-cols-2 sm:grid-rows-4 sm:grid-flow-col sm:gap-x-6 sm:gap-y-10 lg:gap-x-8">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <dt>
                  <CheckIcon className="absolute h-6 w-6 text-green-500" aria-hidden="true" />
                  <p className="ml-9 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                </dt>
                <dd className="mt-2 ml-9 text-base text-gray-500">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="bg-orange-500 rounded-lg shadow-xl overflow-hidden lg:grid lg:grid-cols-2 lg:gap-4">
          <div className="pt-10 pb-12 px-6 sm:pt-16 sm:px-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-20">
            <div className="lg:self-center">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                <span className="block">Ready to dive in?</span>
                <span className="block">Start your free trial today.</span>
              </h2>
              <p className="mt-4 text-lg leading-6 text-warmGray-50">
                We offer a 14 day free trial for all new users.
              </p>
              <a
                href="https://web.socketkit.com/signup"
                className="mt-8 bg-white border border-transparent rounded-md shadow px-5 py-3 inline-flex items-center text-base font-medium text-warmGray-900 hover:bg-orange-100">
                Sign up for free
              </a>
            </div>
          </div>
          <div className="-mt-6 aspect-w-5 aspect-h-3 md:aspect-w-2 md:aspect-h-1">
            <img
              className="transform translate-x-6 translate-y-6 rounded-md object-cover object-left-top sm:translate-x-16 lg:translate-y-20"
              src="/assets/landing-reviews.png"
              alt="App screenshot"
            />
          </div>
        </div>
      </div>
    </Layout>
  )
}
