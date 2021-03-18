import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { Transition } from '@headlessui/react'
import cx from 'classnames'
import { LogoJsonLd } from 'next-seo'
import Badge from './badge.js'
import useVisible from 'hooks/use-visible.js'
import MobileHeader from './mobile-header.js'

export default function Header() {
  const router = useRouter()
  const getActiveClassName = (path) =>
    router.pathname.startsWith(path) ? 'bg-warmGray-50' : 'bg-white'
  const { isVisible, setVisible, ref } = useVisible(false)

  return (
    <header className="bg-white z-10">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex px-2 lg:px-0 flex-1 lg:justify-start justify-between items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <a className="items-center flex">
                  <span className="sr-only">Socketkit, Inc.</span>
                  <Image
                    height={30}
                    width={130}
                    src="/socketkit-logo.svg"
                    alt="Socketkit, Inc."
                    objectPosition="bottom"
                  />
                </a>
              </Link>
              <LogoJsonLd
                logo="http://www.socketkit.com/socketkit-logo.svg"
                url="https://www.socketkit.com"
              />
            </div>
            <nav
              aria-label="Global"
              className="hidden lg:ml-6 lg:flex lg:items-center lg:space-x-4 text-sm font-medium text-warmGray-900">
              <div className="relative z-10" ref={ref}>
                <button
                  type="button"
                  onClick={() => setVisible(!isVisible)}
                  className={cx(['px-3 py-2 rounded-md flex', getActiveClassName('/solutions')])}>
                  <span className="text-warmGray-900 font-medium">Solutions</span>
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
                  show={isVisible}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  leave="transition ease-in duration-150"
                  enterTo="opacity-100 translate-y-0"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1">
                  <div className="absolute z-10 w-96 mt-3 px-2 sm:px-0">
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
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
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
                                d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                              />
                            </svg>
                            <div className="ml-4 flex-1">
                              <p className="text-base font-medium text-warmGray-900 flex justify-between">
                                Mobile Analytics <Badge title="Coming Soon" />
                              </p>
                              <p className="mt-1 text-sm text-trueGray-500">
                                Understand your users&apos; behaviour without compromising privacy.
                              </p>
                            </div>
                          </a>
                        </Link>

                        <div className="-m-3 p-3 flex items-start rounded-lg transition ease-in-out duration-150">
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
                              Track your application&apos;s reviews across the globe.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Transition>
              </div>

              <Link href="/security">
                <a className={cx(['px-3 py-2 rounded-md', getActiveClassName('/security')])}>
                  Security
                </a>
              </Link>

              <Link href="/pricing">
                <a className={cx(['px-3 py-2 rounded-md', getActiveClassName('/pricing')])}>
                  Pricing
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
            <MobileHeader />
          </div>
        </div>
      </div>
    </header>
  )
}
