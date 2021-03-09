import Link from 'next/link'
import Image from 'next/image'
import { Transition } from '@headlessui/react'
import { useState } from 'react'
import cx from 'classnames'
import { LogoJsonLd } from 'next-seo'
import { Badge } from './badge.js'
import useVisible from '../hooks/use-visible.js'

export default function Header() {
  const { isVisible: mobileVisible, setVisible: setMobileVisible } = useVisible(false)
  const {
    isVisible: solutionsVisible,
    setVisible: setSolutionsVisible,
    ref: solutionsRef,
  } = useVisible(false)

  return (
    <header className="bg-white">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-4 py-6 sm:px-6 md:justify-start md:space-x-10 lg:px-8">
        <div className="flex justify-start lg:w-0 lg:flex-1">
          <Link href="/">
            <a>
              <span className="sr-only">Socketkit, Inc.</span>
              <Image height={35} width={165} src="/socketkit-logo.svg" alt="Socketkit, Inc." />
            </a>
          </Link>
          <LogoJsonLd
            logo="http://www.socketkit.com/socketkit-logo.svg"
            url="https://www.socketkit.com"
          />
        </div>
        <div className="-mr-2 -my-2 md:hidden">
          <button
            type="button"
            onClick={() => setMobileVisible(true)}
            className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-trueGray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500">
            <span className="sr-only">Open menu</span>
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
        <nav className="hidden md:flex space-x-10">
          <div className="relative z-10" ref={solutionsRef}>
            <button
              type="button"
              onClick={() => setSolutionsVisible(!solutionsVisible)}
              className={cx(
                solutionsVisible ? 'text-warmGray-900' : 'text-warmGray-900',
                'group bg-white rounded-md inline-flex items-center text-base font-medium hover:text-warmGray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500',
              )}>
              <span>Solutions</span>
              <svg
                className={cx('ml-2 h-5 w-5 group-hover:text-trueGray-500 text-warmGray-900')}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <Transition
              show={solutionsVisible}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              leave="transition ease-in duration-150"
              enterTo="opacity-100 translate-y-0"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1">
              <div className="absolute z-10 left-1/2 transform -translate-x-1/2 mt-3 px-2 w-96 max-w-md sm:px-0">
                <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                  <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
                    <Link href="/solutions/subscriptions">
                      <a className="-m-3 p-3 flex items-start rounded-lg hover:bg-warmGray-50 transition ease-in-out duration-150">
                        <svg
                          className="flex-shrink-0 h-6 w-6 text-orange-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                          />
                        </svg>
                        <div className="ml-4 flex-1">
                          <p className="text-base font-medium text-warmGray-900">
                            Subscription Management
                          </p>
                          <p className="mt-1 text-sm text-trueGray-500">
                            Understand where your revenue is generated and act upon it.
                          </p>
                        </div>
                      </a>
                    </Link>

                    <Link href="/solutions/analytics">
                      <a className="-m-3 p-3 flex items-start rounded-lg hover:bg-warmGray-50 transition ease-in-out duration-150">
                        <svg
                          className="flex-shrink-0 h-6 w-6 text-orange-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                        <div className="ml-4 flex-1">
                          <p className="text-base font-medium text-warmGray-900 flex justify-between">
                            Event Tracking <Badge title="Coming Soon" />
                          </p>
                          <p className="mt-1 text-sm text-trueGray-500">
                            Understand your users' behaviour without compromising privacy.
                          </p>
                        </div>
                      </a>
                    </Link>

                    <Link href="/solutions/subscriptions">
                      <a className="-m-3 p-3 flex items-start rounded-lg hover:bg-warmGray-50 transition ease-in-out duration-150">
                        <svg
                          className="flex-shrink-0 h-6 w-6 text-orange-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                        <div className="ml-4 flex-1">
                          <p className="text-base font-medium text-warmGray-900 flex justify-between">
                            Reviews <Badge title="Coming Soon" />
                          </p>
                          <p className="mt-1 text-sm text-trueGray-500">
                            Track your application's reviews across the globe.
                          </p>
                        </div>
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            </Transition>
          </div>

          <Link href="/pricing">
            <a className="text-base font-medium text-warmGray-900 hover:text-warmGray-500">
              Pricing
            </a>
          </Link>

          <Link href="/security">
            <a className="text-base font-medium text-warmGray-900 hover:text-warmGray-500">
              Security
            </a>
          </Link>
        </nav>
        <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
          <a
            href="https://web.socketkit.com/signin"
            className="whitespace-nowrap text-base font-medium text-warmGray-900 hover:text-warmGray-500">
            Sign in
          </a>
          <a
            href="https://web.socketkit.com/signup"
            className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 rounded-md shadow-sm text-base font-medium text-white bg-orange-500 hover:bg-orange-400">
            Sign up
          </a>
        </div>
        <Transition
          show={mobileVisible}
          enter="duration-200 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-100 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95">
          <div className="absolute z-30 top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden">
            <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
              <div className="pt-5 pb-6 px-5">
                <div className="flex items-center justify-between">
                  <div>
                    <img src="/socketkit-icon.svg" alt="Socketkit, Inc" height={40} width={40} />
                  </div>
                  <div className="-mr-2">
                    <button
                      type="button"
                      onClick={() => setMobileVisible(false)}
                      className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-trueGray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500">
                      <span className="sr-only">Close menu</span>
                      <svg
                        className="h-6 w-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="mt-6">
                  <nav className="grid grid-cols-1 gap-7">
                    <Link href="/pricing">
                      <a className="-m-3 p-3 flex items-center rounded-lg hover:bg-warmGray-50">
                        <div className="ml-4 text-base font-medium text-warmGray-900">Pricing</div>
                      </a>
                    </Link>

                    <Link href="/security">
                      <a className="-m-3 p-3 flex items-center rounded-lg hover:bg-warmGray-50">
                        <div className="ml-4 text-base font-medium text-warmGray-900">Security</div>
                      </a>
                    </Link>

                    <Link href="/company">
                      <a className="-m-3 p-3 flex items-center rounded-lg hover:bg-warmGray-50">
                        <div className="ml-4 text-base font-medium text-warmGray-900">About</div>
                      </a>
                    </Link>
                  </nav>
                </div>
              </div>
              <div className="py-6 px-5 space-y-4 flex flex-col">
                <a
                  href="https://web.socketkit.com/signup"
                  className="w-full flex items-center justify-center px-4 py-2 rounded-md shadow-sm text-base font-medium text-white bg-orange-500 hover:bg-orange-400">
                  Sign up
                </a>
                <a
                  href="https://web.socketkit.com/signin"
                  className="text-warmGray-900 hover:text-warmGray-500 text-center text-base font-medium">
                  Sign in
                </a>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </header>
  )
}
