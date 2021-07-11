import Image from 'next/image'
import { BreadcrumbJsonLd, NextSeo } from 'next-seo'
import Layout from 'components/layout.js'
import CTA from 'components/cta.js'

export default function Subscriptions() {
  return (
    <Layout>
      <NextSeo
        title={'Subscription Management for Appstore & PlayStore'}
        description={`Understand where your Apple AppStore and Google Playstore application customers and revenues are coming from. Access to different reports including MRR and ARPU.`}
      />

      <BreadcrumbJsonLd
        itemListElements={[
          {
            position: 1,
            name: 'Subscriptions',
            item: 'https://socketkit.com/solutions/subscriptions',
          },
        ]}
      />

      <div className="relative bg-white pt-16 sm:pt-24 lg:pt-32 overflow-hidden">
        <div className="mx-auto max-w-md text-center  sm:max-w-3xl lg:max-w-7xl">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
              Subscription Management <br></br>for AppStore & Google Playstore
            </h1>
            <p className="mt-5 max-w-prose mx-auto text-xl text-gray-500">
              Understand where your customers and revenues are coming from.
            </p>
          </div>
          <div className="mt-12 -mb-10 sm:-mb-24 lg:-mb-48">
            <div className="rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 overflow-hidden">
              <Image
                src="/assets/landing-dashboard.png"
                alt="Subscription Management for AppStore & Playstore"
                width={800}
                height={488}
                layout="responsive"
                unoptimized={process.env.NODE_ENV === 'development'}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="relative bg-white pt-16 sm:pt-24 lg:pt-28">
        <div className="mx-auto max-w-md px-4 text-center sm:max-w-3xl sm:px-6 lg:px-8 lg:max-w-7xl">
          <p className="mt-2 text-3xl font-extrabold text-warmGray-900 tracking-tight sm:text-4xl">
            Learn more about your subscribers
          </p>
          <p className="mt-5 max-w-prose mx-auto text-xl text-trueGray-500">
            Access to various reports and analyze your revenue stream
          </p>
          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="pt-6">
                <div className="flow-root bg-warmGray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-md shadow-lg bg-white">
                        <svg
                          className="h-6 w-6 text-orange-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                          />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-semibold text-warmGray-900 tracking-tight">
                      Subscriptions
                    </h3>
                    <p className="mt-5 text-base text-trueGray-500">
                      Access your active subscriptions and their movements in real-time and act
                      fastly on anomalies.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-warmGray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-md shadow-lg bg-white">
                        <svg
                          className="h-6 w-6 text-orange-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-semibold text-warmGray-900 tracking-tight">
                      MRR
                    </h3>
                    <p className="mt-5 text-base text-trueGray-500">
                      Analyze your normalised monthly recurring revenue and calculate your
                      business&apos; monthly income.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-warmGray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-md shadow-lg bg-white">
                        <svg
                          className="h-6 w-6 text-orange-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                          />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-semibold text-warmGray-900 tracking-tight">
                      Leads
                    </h3>
                    <p className="mt-5 text-base text-trueGray-500">
                      Understand your leads&apos; trial-to-paid conversion rate as well as their
                      average sales cycle length.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-warmGray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-md shadow-lg bg-white">
                        <svg
                          className="h-6 w-6 text-orange-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-semibold text-warmGray-900 tracking-tight">
                      Life Time Value
                    </h3>
                    <p className="mt-5 text-base text-trueGray-500">
                      Access to a projection of your customers&apos; life time value, average
                      revenue and average sale/transaction price.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-warmGray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-md shadow-lg bg-white">
                        <svg
                          className="h-6 w-6 text-orange-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                          />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-semibold text-warmGray-900 tracking-tight">
                      Customer Churn Rate
                    </h3>
                    <p className="mt-5 text-base text-trueGray-500">
                      Understand the rate of which your customers are cancelling and create
                      actionable insight for your business.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-warmGray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-md shadow-lg bg-white">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="h-6 w-6 text-orange-500">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-semibold text-warmGray-900 tracking-tight">
                      MRR Churn Rate
                    </h3>
                    <p className="mt-5 text-base text-trueGray-500">
                      Understand the churn rate behind downgrades and/or cancellations to your
                      existing revenue stream.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CTA />
    </Layout>
  )
}
