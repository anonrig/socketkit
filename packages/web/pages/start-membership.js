import { useState } from 'react'
import {
  UsersIcon,
  CalendarIcon,
  ViewBoardsIcon,
  PresentationChartLineIcon,
  CheckIcon,
} from '@heroicons/react/outline'
import toast from 'react-hot-toast'
import cx from 'classnames'

import Loading from 'components/loading.js'

import { fetcher } from 'helpers/fetcher.js'
import getStripe from 'helpers/stripe.js'

function StartMembership() {
  const [loading, setLoading] = useState(false)

  async function navigate() {
    setLoading(true)
    try {
      const { session_id } = await fetcher(`payments/checkout`)
      const stripe = await getStripe()
      await stripe.redirectToCheckout({
        sessionId: session_id,
      })
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:pt-12 sm:pb-4 sm:px-6 lg:px-8 text-center">
        <p className="text-4xl font-extrabold text-warmGray-900 sm:text-5xl sm:tracking-tight">
          Start your free trial, today.
        </p>
        <p className="max-w-xl mx-auto mt-5 text-xl text-trueGray-500">
          14 days free trial, then pay as you scale.
        </p>
      </div>
      <div className="relative bg-white">
        <div className="relative max-w-7xl mx-auto lg:grid lg:grid-cols-2 lg:px-8">
          <div className="bg-white px-4 sm:px-6 lg:px-0 lg:pr-8">
            <div className="max-w-lg mx-auto lg:mx-0">
              <dl className="mt-12 space-y-10">
                <div className="flex">
                  <div className="flex-shrink-0 h-12 w-12 bg-orange-500 rounded-md flex items-center justify-center">
                    <PresentationChartLineIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <dt className="text-lg leading-6 font-medium text-warmGray-900">
                      Real-time Analytics
                    </dt>
                    <dd className="mt-2 text-base text-trueGray-500">
                      Get real-time insights on your customers and transactions, and respond fast to
                      market changes.
                    </dd>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex-shrink-0 h-12 w-12 bg-orange-500 rounded-md flex items-center justify-center">
                    <ViewBoardsIcon className="h-6 w-6 text-white" />
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
                    <CalendarIcon className="h-6 w-6 text-white" />
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
                    <UsersIcon className="h-6 w-6 text-white" />
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
                        of your revenue
                      </span>
                    </span>
                  </span>
                </p>
              </div>
              <ul className="bg-cyan-700 bg-opacity-50 rounded sm:grid sm:grid-cols-2 sm:grid-rows-3 sm:grid-flow-col">
                <li className="py-4 px-4 flex items-center text-base text-trueGray-500">
                  <CheckIcon className="h-6 w-6 text-trueGray-500" />
                  <span className="ml-3">Unlimited Customers</span>
                </li>
                <li className="border-t border-warmGray-300 border-opacity-25 py-4 px-4 flex items-center text-base text-trueGray-500">
                  <CheckIcon className="h-6 w-6 text-trueGray-500" />
                  <span className="ml-3">Unlimited Transactions</span>
                </li>
                <li className="border-t border-warmGray-300 border-opacity-25 py-4 px-4 flex items-center text-base text-trueGray-500">
                  <CheckIcon className="h-6 w-6 text-trueGray-500" />
                  <span className="ml-3">CSV Exports</span>
                </li>
                <li className="border-t border-warmGray-300 border-opacity-25 py-4 px-4 flex items-center text-base text-trueGray-500 sm:border-t-0 sm:border-l">
                  <CheckIcon className="h-6 w-6 text-trueGray-500" />
                  <span className="ml-3">Built-in Security</span>
                </li>
                <li className="border-t border-warmGray-300 border-opacity-25 py-4 px-4 flex items-center text-base text-trueGray-500 sm:border-l">
                  <CheckIcon className="h-6 w-6 text-trueGray-500" />
                  <span className="ml-3">24/7 support</span>
                </li>
                <li className="border-t border-warmGray-300 border-opacity-25 py-4 px-4 flex items-center text-base text-trueGray-500 sm:border-l">
                  <CheckIcon className="h-6 w-6 text-trueGray-500" />
                  <span className="ml-3">Cancel anytime</span>
                </li>
              </ul>
              <button
                onClick={() => navigate()}
                className="w-full relative border border-transparent rounded-md py-4 px-8 flex items-center justify-center text-lg leading-6 font-medium text-white bg-orange-500 md:px-10">
                <span className={cx([loading ? 'opacity-0' : null])}>Start Free Trial</span>
                {loading && (
                  <Loading className="absolute inset-0 flex flex-1 items-center justify-center" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default StartMembership
