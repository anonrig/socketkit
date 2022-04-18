import { Fragment } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/router'
import { Transition, Popover } from '@headlessui/react'
import cx from 'classnames'
import { LogoJsonLd } from 'next-seo'

import {
  ChartBarIcon,
  CursorClickIcon,
  MenuIcon,
  ShieldCheckIcon,
  ViewGridIcon,
  XIcon,
} from '@heroicons/react/outline'
import { ChevronDownIcon } from '@heroicons/react/solid'

const solutions = [
  {
    name: 'Subscription Management ',
    description: 'Understand where your revenue is generated and act upon it.',
    href: '/solutions/subscriptions',
    icon: ChartBarIcon,
  },
  {
    name: 'Review Tracking',
    description: 'Real-time application reviews across different app stores.',
    href: '/solutions/reviews',
    icon: ShieldCheckIcon,
  },
  {
    name: 'Mobile-first Analytics',
    description: 'Understand user behavior without compromising privacy.',
    href: '/solutions/analytics',
    icon: CursorClickIcon,
  },
  {
    name: 'Integrations',
    description: "Connect with third-party tools that you're already using.",
    href: '/solutions/integrations',
    icon: ViewGridIcon,
  },
]

const resources = [
  {
    name: 'Security',
    description: 'We follow the best practices, and we are transparent about it.',
    href: '/security',
  },
  {
    name: 'Company',
    description: 'Meet with the team behind Socketkit and contact us.',
    href: '/company',
  },
  {
    name: 'Guides & Tips',
    description: 'We care about sharing the things we learned along the way.',
    href: '/blog',
  },
]

export default function Header() {
  const router = useRouter()
  const getActiveClassName = (path) =>
    router.pathname.startsWith(path) ? 'bg-warmGray-50' : 'bg-white'

  return (
    <Popover className="relative bg-white z-10">
      {({ open }) => (
        <>
          <div className="flex justify-between items-center px-4 py-3 sm:px-6 md:justify-start md:space-x-10">
            <div className="flex justify-start lg:w-0 lg:flex-1">
              <Link href="/">
                <a className="items-center flex">
                  <span className="sr-only">Socketkit, Inc.</span>
                  <img height={30} width={130} src="/socketkit-logo.svg" alt="Socketkit, Inc." />
                </a>
              </Link>
              <LogoJsonLd
                logo="http://socketkit.com/socketkit-logo.svg"
                url="https://socketkit.com"
              />
            </div>
            <div className="-mr-2 -my-2 md:hidden">
              <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500">
                <span className="sr-only">Open menu</span>
                <MenuIcon className="h-6 w-6" aria-hidden="true" />
              </Popover.Button>
            </div>
            <Popover.Group as="nav" className="hidden md:flex space-x-10">
              <Popover className="relative">
                {({ open }) => (
                  <>
                    <Popover.Button
                      className={cx(
                        getActiveClassName('/solutions'),
                        'px-3 py-2 rounded-md group bg-white rounded-md inline-flex items-center text-base font-medium hover:text-warmGray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500',
                      )}>
                      <span>Solutions</span>
                      <ChevronDownIcon
                        className={cx(
                          open ? 'text-gray-600' : 'text-gray-400',
                          'ml-2 h-5 w-5 group-hover:text-gray-500',
                        )}
                        aria-hidden="true"
                      />
                    </Popover.Button>

                    <Transition
                      show={open}
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="opacity-0 translate-y-1"
                      enterTo="opacity-100 translate-y-0"
                      leave="transition ease-in duration-150"
                      leaveFrom="opacity-100 translate-y-0"
                      leaveTo="opacity-0 translate-y-1">
                      <Popover.Panel
                        static
                        className="absolute z-10 -ml-4 mt-3 transform w-screen max-w-md lg:max-w-2xl lg:ml-0 lg:left-1/2 lg:-translate-x-1/2">
                        <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                          <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8 lg:grid-cols-2">
                            {solutions.map((item) => (
                              <Link key={item.name} href={item.href}>
                                <a className="-m-3 p-3 flex items-start rounded-lg hover:bg-gray-50">
                                  <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-md bg-orange-500 text-white sm:h-12 sm:w-12">
                                    <item.icon className="h-6 w-6" aria-hidden="true" />
                                  </div>
                                  <div className="ml-4">
                                    <p className="text-base font-medium text-gray-900">
                                      {item.name}
                                    </p>
                                    <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                                  </div>
                                </a>
                              </Link>
                            ))}
                          </div>
                          <div className="p-5 bg-gray-50 sm:p-8">
                            <a
                              href="https://awacs.socketkit.com"
                              className="-m-3 p-3 flow-root rounded-md hover:bg-gray-100">
                              <div className="flex items-center">
                                <div className="text-base font-medium text-gray-900">
                                  Open-source Event Tracking
                                </div>
                                <span className="ml-3 inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium leading-5 bg-orange-100 text-orange-800">
                                  Upcoming
                                </span>
                              </div>
                              <p className="mt-1 text-sm text-gray-500">
                                Integrated mobile event tracking with our open-source server{' '}
                                <b>Awacs</b>
                              </p>
                            </a>
                          </div>
                        </div>
                      </Popover.Panel>
                    </Transition>
                  </>
                )}
              </Popover>

              <Link href="/pricing">
                <a
                  className={cx([
                    'px-3 py-2 rounded-md font-medium',
                    getActiveClassName('/pricing'),
                  ])}>
                  Pricing
                </a>
              </Link>

              <Popover className="relative">
                {({ open }) => (
                  <>
                    <Popover.Button
                      className={cx(
                        'px-3 py-2 rounded-md group bg-white rounded-md inline-flex items-center text-base font-medium hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500',
                      )}>
                      <span>More</span>
                      <ChevronDownIcon
                        className={cx(
                          open ? 'text-gray-600' : 'text-gray-400',
                          'ml-2 h-5 w-5 group-hover:text-gray-500',
                        )}
                        aria-hidden="true"
                      />
                    </Popover.Button>

                    <Transition
                      show={open}
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="opacity-0 translate-y-1"
                      enterTo="opacity-100 translate-y-0"
                      leave="transition ease-in duration-150"
                      leaveFrom="opacity-100 translate-y-0"
                      leaveTo="opacity-0 translate-y-1">
                      <Popover.Panel
                        static
                        className="absolute z-10 left-1/2 transform -translate-x-1/2 mt-3 px-2 w-screen max-w-xs sm:px-0">
                        <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                          <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
                            {resources.map((item) => (
                              <Link href={item.href} key={item.name}>
                                <a className="-m-3 p-3 block rounded-md hover:bg-gray-50">
                                  <p className="text-base font-medium text-gray-900">{item.name}</p>
                                  <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                                </a>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </Popover.Panel>
                    </Transition>
                  </>
                )}
              </Popover>
            </Popover.Group>
            <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0" />
          </div>

          <Transition
            show={open}
            as={Fragment}
            enter="duration-200 ease-out"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="duration-100 ease-in"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95">
            <Popover.Panel
              focus
              static
              className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden">
              <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
                <div className="pt-5 pb-6 px-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <img
                        height={30}
                        width={130}
                        src="/socketkit-logo.svg"
                        alt="Socketkit, Inc."
                      />
                    </div>
                    <div className="-mr-2">
                      <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500">
                        <span className="sr-only">Close menu</span>
                        <XIcon className="h-6 w-6" aria-hidden="true" />
                      </Popover.Button>
                    </div>
                  </div>
                  <div className="mt-6">
                    <nav className="grid grid-cols-1 gap-7">
                      {solutions.map((item) => (
                        <Link key={item.name} href={item.href}>
                          <a className="-m-3 p-3 flex items-center rounded-lg hover:bg-gray-50">
                            <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-md bg-orange-500 text-white">
                              <item.icon className="h-6 w-6" aria-hidden="true" />
                            </div>
                            <div className="ml-4 text-base font-medium text-gray-900">
                              {item.name}
                            </div>
                          </a>
                        </Link>
                      ))}
                    </nav>
                  </div>
                </div>
                <div className="py-6 px-5">
                  <div className="grid grid-cols-2 gap-4">
                    <Link href="/pricing">
                      <a className="text-base font-medium text-gray-900 hover:text-gray-700">
                        Pricing
                      </a>
                    </Link>
                    {resources.map((item) => (
                      <Link key={item.href} href={item.href}>
                        <a className="text-base font-medium text-gray-900 hover:text-gray-700">
                          {item.name}
                        </a>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  )
}
