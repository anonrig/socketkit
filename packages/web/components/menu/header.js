import { useContext } from 'react'
import cx from 'classnames'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'

import { Disclosure } from '@headlessui/react'
import { MenuIcon, XIcon } from '@heroicons/react/solid'
import { UserCircleIcon } from '@heroicons/react/outline'

import ProfileDropdown from 'components/menu/profile-dropdown.js'

import { AuthContext } from 'helpers/context.js'
import { getUrl } from 'helpers/fetcher.js'
import { endpoints } from 'helpers/kratos.js'

function Header() {
  const router = useRouter()
  const { session } = useContext(AuthContext)
  const getActiveClassName = (path) =>
    router.pathname.startsWith(path) ? 'bg-warmGray-50' : 'bg-white'

  return (
    <Disclosure as="nav" className="bg-white shadow z-10">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex px-2 lg:px-0">
            <div className="flex-shrink-0 flex items-center rounded-full">
              <Link href="/">
                <a className="flex items-center">
                  <Image alt="Socketkit, Inc." width={38} height={38} src="/socketkit-icon.svg" />
                </a>
              </Link>
            </div>
            <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4 text-sm font-medium text-warmGray-900">
              <Link href="/applications">
                <a className={cx(['px-3 py-2 rounded-md', getActiveClassName('/applications')])}>
                  Applications
                </a>
              </Link>
              <Link href="/events">
                <a className={cx(['px-3 py-2 rounded-md', getActiveClassName('/events')])}>
                  Events
                </a>
              </Link>
              <Link href="/reports">
                <a className={cx(['px-3 py-2 rounded-md', getActiveClassName('/reports')])}>
                  Reports
                </a>
              </Link>
              <Link href="/customers">
                <a className={cx(['px-3 py-2 rounded-md', getActiveClassName('/customers')])}>
                  Customers
                </a>
              </Link>
              <Link href="/reviews">
                <a className={cx(['px-3 py-2 rounded-md', getActiveClassName('/reviews')])}>
                  Reviews
                </a>
              </Link>
            </div>
          </div>

          <div className="flex items-center md:hidden">
            <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
              <span className="sr-only">Open main menu</span>
              <MenuIcon className="h-6 w-6" />
            </Disclosure.Button>
          </div>
          <ProfileDropdown className="hidden md:ml-4 md:flex md:items-center" />
        </div>
      </div>

      <Disclosure.Panel className="sm:hidden">
        <div className="z-30 absolute top-0 right-0 max-w-none w-full p-2 transition transform origin-top lg:hidden">
          <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y divide-gray-200">
            <div className="pt-3 pb-2">
              <div className="flex items-center justify-between px-4">
                <Image alt="Socketkit, Inc." src="/socketkit-icon.svg" height={40} width={40} />
                <div className="-mr-2">
                  <Disclosure.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
                    <span className="sr-only">Close menu</span>
                    <XIcon className={'h-6 w-6'} />
                  </Disclosure.Button>
                </div>
              </div>
              <div className="mt-3 px-2 space-y-1">
                <Link href="/applications">
                  <a className="block w-full text-left rounded-md px-3 py-2 text-base text-gray-900 font-medium hover:bg-gray-100 hover:text-gray-800">
                    Applications
                  </a>
                </Link>
                <Link href="/events">
                  <a className="block w-full text-left rounded-md px-3 py-2 text-base text-gray-900 font-medium hover:bg-gray-100 hover:text-gray-800">
                    Events
                  </a>
                </Link>
                <Link href="/reports">
                  <a className="block w-full text-left rounded-md px-3 py-2 text-base text-gray-900 font-medium hover:bg-gray-100 hover:text-gray-800">
                    Reports
                  </a>
                </Link>
                <Link href="/customers">
                  <a className="block w-full text-left rounded-md px-3 py-2 text-base text-gray-900 font-medium hover:bg-gray-100 hover:text-gray-800">
                    Customers
                  </a>
                </Link>
                <Link href="/reviews">
                  <a className="block w-full text-left rounded-md px-3 py-2 text-base text-gray-900 font-medium hover:bg-gray-100 hover:text-gray-800">
                    Reviews
                  </a>
                </Link>
              </div>
            </div>
            <div className="pt-4 pb-2">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <UserCircleIcon className="h-10 w-10 rounded-full" />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">
                    {session?.identity.traits.name}
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    {session?.identity.traits.email}
                  </div>
                </div>
              </div>
              <div className="mt-3 px-2 space-y-1">
                <Link href="/account">
                  <a className="w-full text-left block rounded-md px-3 py-2 text-base text-gray-900 font-medium hover:bg-gray-100 hover:text-gray-800">
                    Account Settings
                  </a>
                </Link>
                <a
                  href={getUrl('payments/portal')}
                  className="w-full text-left block rounded-md px-3 py-2 text-base text-gray-900 font-medium hover:bg-gray-100 hover:text-gray-800">
                  Billing & Plan
                </a>
                <Link href="/products">
                  <a className="w-full text-left block rounded-md px-3 py-2 text-base text-gray-900 font-medium hover:bg-gray-100 hover:text-gray-800">
                    Products & Integrations
                  </a>
                </Link>
                <a
                  href={endpoints.logout}
                  className="w-full text-left block rounded-md px-3 py-2 text-base text-gray-900 font-medium hover:bg-gray-100 hover:text-gray-800">
                  Log out
                </a>
              </div>
            </div>
          </div>
        </div>
        <div aria-hidden="true" className="z-20 fixed inset-0 bg-black bg-opacity-25 lg:hidden" />
      </Disclosure.Panel>
    </Disclosure>
  )
}

export default Header
