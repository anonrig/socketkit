import Image from 'next/image'
import CTA from 'components/cta.js'
import Layout from 'components/layout.js'

export default function Home() {
  return (
    <Layout>
      <main>
        {/* Hero section */}
        <div className="relative">
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gray-100" />
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="relative shadow-xl sm:rounded-2xl sm:overflow-hidden">
              <div className="absolute inset-0">
                <Image
                  objectFit="cover"
                  objectPosition="center"
                  layout="fill"
                  src={'/assets/landing-hero.png'}
                  className="h-full w-full"
                  alt="A developer accessing Socketkit"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500 to-orange-500"
                  style={{ mixBlendMode: 'multiply' }}
                />
              </div>
              <div className="relative px-4 py-16 sm:px-6 sm:py-24 lg:py-32 lg:px-8">
                <h1 className="text-center text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                  <span className="block text-white">Take control of your</span>
                  <span className="block text-orange-500">analytical data</span>
                </h1>
                <p className="mt-6 max-w-lg mx-auto text-center text-xl text-white sm:max-w-3xl">
                  Subscription management & event tracking for privacy advocates.
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Alternating Feature Sections */}
        <div className="relative pt-16 pb-32 lg:overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-gray-100"
          />
          <div className="relative">
            <div className="lg:mx-auto lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-2 lg:grid-flow-col-dense lg:gap-24">
              <div className="my-28 px-4 max-w-xl mx-auto sm:px-6 lg:py-16 lg:max-w-none lg:mx-0 lg:px-0">
                <div>
                  <div className="mt-6">
                    <h2 className="text-3xl font-extrabold tracking-tight text-warmGray-900">
                      Manage your subscriptions
                    </h2>
                    <p className="mt-4 text-lg text-trueGray-500">
                      Connect your App Store Connect or Google PlayStore account to easily track
                      your subscriptions and in-app purchases across the globe.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-12 sm:mt-16 lg:mt-0 lg:overflow-visible overflow-hidden pb-8 lg:pb-0">
                <div className="pl-4 -mr-48 sm:pl-6 md:-mr-16 lg:px-0 lg:m-0 lg:relative lg:h-full">
                  <img
                    className="w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 lg:absolute lg:left-0 lg:h-full lg:w-auto lg:max-w-none"
                    src="/assets/landing-dashboard.png"
                    alt="Subscription management for Appstore and Playstore"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-24">
            <div className="lg:mx-auto lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-2 lg:grid-flow-col-dense lg:gap-24">
              <div className="my-12 px-4 max-w-xl mx-auto sm:px-6 lg:py-32 lg:max-w-none lg:mx-0 lg:px-0 lg:col-start-2">
                <div>
                  <div className="mt-6">
                    <h2 className="text-3xl font-extrabold tracking-tight text-warmGray-900">
                      Access Actionable Reports
                    </h2>
                    <p className="mt-4 text-lg text-trueGray-500">
                      Better understand your audience and your income flow from application stores
                      using the pre-made reports by Socketkit. Figure out where you're losing your
                      audience and the reason behind it.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-12 sm:mt-16 lg:mt-0 lg:col-start-1">
                <div className="pr-4 -ml-48 sm:pr-6 md:-ml-16 lg:px-0 lg:m-0 lg:relative lg:h-full">
                  <img
                    className="w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 lg:absolute lg:right-0 lg:h-full lg:w-auto lg:max-w-none"
                    src="/assets/landing-filters.png"
                    alt="Socketkit free trials report filters shown"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative mb-24">
          <div className="lg:mx-auto lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-2 lg:grid-flow-col-dense lg:gap-24">
            <div className="my-28 px-4 max-w-xl mx-auto sm:px-6 lg:py-16 lg:max-w-none lg:mx-0 lg:px-0">
              <div>
                <div className="mt-6">
                  <h2 className="text-3xl font-extrabold tracking-tight text-warmGray-900">
                    Manage User Feedbacks
                  </h2>
                  <p className="mt-4 text-lg text-trueGray-500">
                    Follow new reviews from AppStore and Playstore from more than 155 countries.
                    Track your competitors and receive notifications from Slack, Discord and
                    Microsoft Teams.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-12 sm:mt-16 lg:mt-0 lg:overflow-visible overflow-hidden pb-8 lg:pb-0">
              <div className="pl-4 -mr-48 sm:pl-6 md:-mr-16 lg:px-0 lg:m-0 lg:relative lg:h-full">
                <img
                  className="w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 lg:absolute lg:left-0 lg:h-full lg:w-auto lg:max-w-none"
                  src="/assets/landing-reviews.png"
                  alt="AppStore and PlayStore review management"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="relative bg-warmGray-50">
          <div className="h-80 absolute bottom-0 xl:inset-0 xl:h-auto xl:grid xl:grid-cols-2 hidden lg:visible">
            <div className="h-full absolute inset-0 col-start-2">
              <Image
                className="h-full w-full object-cover xl:absolute xl:inset-0"
                src={'/assets/people-using-laptop.png'}
                layout="fill"
                objectFit="cover"
                objectPosition="center"
                alt="People working on laptops"
              />
              <div className="absolute inset-0 opacity-50 bg-gradient-to-r from-blue-200 to-orange-500" />
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-128 bg-gradient-to-b from-warmGray-50 xl:inset-y-0 xl:left-0 xl:h-full xl:w-128 xl:bg-gradient-to-r"
              />
            </div>
          </div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8 xl:grid xl:grid-cols-2 xl:grid-flow-col-dense xl:gap-x-8">
            <div className="relative pt-24 pb-24 xl:col-start-1 xl:pb-24">
              <h2 className="text-sm font-semibold tracking-wide uppercase">
                <span className="text-orange-500">Valuable Metrics</span>
              </h2>
              <p className="mt-3 text-3xl font-extrabold text-warmGray-900">
                Get actionable data that will help grow your business
              </p>
              <p className="mt-5 text-lg text-trueGray-500">
                Learn your conversion and churn rates from different countries and audiences to get
                actionable data best fits your business. Analyze your revenue flow from various
                filters and better understand anomalies and act upon them.
              </p>
              <div className="mt-12 grid grid-cols-1 gap-y-12 gap-x-6 sm:grid-cols-2">
                <p>
                  <span className="block text-2xl font-bold text-blue-500">28K+</span>
                  <span className="mt-1 block text-base text-trueGray-500">
                    <span className="font-semibold">Subscriptions</span> are tracked monthly using
                    Socketkit.
                  </span>
                </p>
                <p>
                  <span className="block text-2xl font-bold text-blue-500">96K+</span>
                  <span className="mt-1 block text-base text-trueGray-500">
                    <span className="font-semibold">Transactions</span> were stored and analyzed on
                    Socketkit.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <CTA />
      </main>
    </Layout>
  )
}
