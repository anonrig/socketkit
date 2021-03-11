import { NextSeo } from 'next-seo'
import Layout from 'components/layout.js'

export default function Pricing() {
  return (
    <Layout>
      <NextSeo
        title={'Pricing & Plans'}
        description={`Our pricing model is simple. Start using Socketkit freely up to $5000 MRR, and than scale as you go. Join now.`}
      />
      <div className="bg-white">
        <div>
          <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-base font-semibold text-orange-500 uppercase tracking-wide">
                Pricing
              </h1>
              <p className="mt-1 text-4xl font-extrabold text-warmGray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                Take control of your mobile app
              </p>
              <p className="max-w-xl mx-auto mt-5 text-xl text-trueGray-500">
                Start using for free, then pay as you scale your income.
              </p>
            </div>
          </div>
        </div>
        <div className="relative bg-white">
          <div className="absolute inset-0" aria-hidden="true">
            <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-r from-cyan-600 to-green-400" />
          </div>
          <div className="relative max-w-7xl mx-auto lg:grid lg:grid-cols-2 lg:px-8">
            <div className="bg-white py-16 px-4 sm:py-24 sm:px-6 lg:px-0 lg:pr-8">
              <div className="max-w-lg mx-auto lg:mx-0">
                <h2 className="text-base font-semibold tracking-wide text-orange-500 uppercase">
                  Subscription Management
                </h2>
                <p className="mt-2 text-2xl font-extrabold text-warmGray-900 sm:text-3xl">
                  Everything you need to understand your income flow
                </p>
                <dl className="mt-12 space-y-10">
                  <div className="flex">
                    <div className="flex-shrink-0 h-12 w-12 bg-orange-500 rounded-md flex items-center justify-center">
                      <svg
                        className="h-6 w-6 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <dt className="text-lg leading-6 font-medium text-warmGray-900">
                        Real-time Analytics
                      </dt>
                      <dd className="mt-2 text-base text-trueGray-500">
                        Get real-time insights on your customers and transactions, and respond fast
                        to market changes.
                      </dd>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="flex-shrink-0 h-12 w-12 bg-orange-500 rounded-md flex items-center justify-center">
                      <svg
                        className="h-6 w-6 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <dt className="text-lg leading-6 font-medium text-warmGray-900">Reports</dt>
                      <dd className="mt-2 text-base text-trueGray-500">
                        Access to pre-made reports to better understand and increase your revenue
                        stream, easily accessible.
                      </dd>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="flex-shrink-0 h-12 w-12 bg-orange-500 rounded-md flex items-center justify-center">
                      <svg
                        className="h-6 w-6 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <dt className="text-lg leading-6 font-medium text-warmGray-900">
                        Notifications
                      </dt>
                      <dd className="mt-2 text-base text-trueGray-500">
                        Get instant notifications upon dramatic changes on your revenue stream by
                        either e-mail or notification.
                      </dd>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="flex-shrink-0 h-12 w-12 bg-orange-500 rounded-md flex items-center justify-center">
                      <svg
                        className="h-6 w-6 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <dt className="text-lg leading-6 font-medium text-warmGray-900">
                        Data Ownership
                      </dt>
                      <dd className="mt-2 text-base text-trueGray-500">
                        Your customers&apos; data belong to you. We only store and process it with
                        your permission.
                      </dd>
                    </div>
                  </div>
                </dl>
              </div>
            </div>
            <div className="py-16 px-4 sm:py-24 sm:px-6 lg:bg-none lg:flex lg:items-center lg:justify-end lg:px-0 lg:pl-8">
              <div className="max-w-lg mx-auto w-full space-y-8 lg:mx-0">
                <div>
                  <h2 className="sr-only">Price</h2>
                  <p className="relative grid grid-cols-2">
                    <span className="flex flex-col text-center">
                      <span className="text-5xl font-extrabold text-warmGray-900 tracking-tight">
                        $15
                      </span>
                      <span className="mt-2 text-base font-medium text-cyan-100">Base fee</span>
                      <span className="sr-only">plus</span>
                    </span>
                    <span
                      className="pointer-events-none absolute h-12 w-full flex items-center justify-center"
                      aria-hidden="true">
                      <svg
                        className="h-6 w-6 text-trueGray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </span>
                    <span>
                      <span className="flex flex-col text-center">
                        <span className="text-5xl font-extrabold text-warmGray-900 tracking-tight">
                          %0.5
                        </span>
                        <span className="mt-2 text-base font-medium text-cyan-100">
                          of Your MRR
                        </span>
                      </span>
                    </span>
                  </p>
                </div>
                <ul className="bg-cyan-700 bg-opacity-50 rounded sm:grid sm:grid-cols-2 sm:grid-rows-3 sm:grid-flow-col">
                  <li className="py-4 px-4 flex items-center text-base text-trueGray-500">
                    <svg
                      className="h-6 w-6 text-trueGray-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="ml-3">Unlimited Customers</span>
                  </li>
                  <li className="border-t border-warmGray-300 border-opacity-25 py-4 px-4 flex items-center text-base text-trueGray-500">
                    <svg
                      className="h-6 w-6 text-trueGray-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="ml-3">Unlimited Transactions</span>
                  </li>
                  <li className="border-t border-warmGray-300 border-opacity-25 py-4 px-4 flex items-center text-base text-trueGray-500">
                    <svg
                      className="h-6 w-6 text-trueGray-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="ml-3">CSV Exports</span>
                  </li>
                  <li className="border-t border-warmGray-300 border-opacity-25 py-4 px-4 flex items-center text-base text-trueGray-500 sm:border-t-0 sm:border-l">
                    <svg
                      className="h-6 w-6 text-trueGray-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="ml-3">Built-in Security</span>
                  </li>
                  <li className="border-t border-warmGray-300 border-opacity-25 py-4 px-4 flex items-center text-base text-trueGray-500 sm:border-l">
                    <svg
                      className="h-6 w-6 text-trueGray-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="ml-3">24/7 support</span>
                  </li>
                  <li className="border-t border-warmGray-300 border-opacity-25 py-4 px-4 flex items-center text-base text-trueGray-500 sm:border-l">
                    <svg
                      className="h-6 w-6 text-trueGray-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="ml-3">Cancel anytime</span>
                  </li>
                </ul>
                <a
                  href="https://web.socketkit.com"
                  className="w-full border border-transparent rounded-md py-4 px-8 flex items-center justify-center text-lg leading-6 font-medium text-white bg-orange-500 md:px-10">
                  Start using for free
                </a>
                <p className="text-warmGray-500 text-center text-sm">
                  Socketkit is always <span className="font-semibold">free up to $5000</span>{' '}
                  Monthly Recurring Revenue.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
