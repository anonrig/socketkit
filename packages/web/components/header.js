import { useContext, useState } from 'react'
import cx from 'classnames'
import Link from 'next/link'

// @ts-ignore
import logo from '..//images/socketkit.svg'

import MobileMenu from './menu/mobile.js'
import ProfileDropdown from './menu/profile-dropdown.js'
import { AuthContext } from '../helpers/is-authorized.js'

function Header() {
  const { session } = useContext(AuthContext)
  const [menuVisible, setMenuVisible] = useState(false)
  return (
    <header className="bg-white shadow z-10">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex px-2 lg:px-0">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                  <img alt="Socketkit, Inc." className="h-8 w-auto" src={logo} />
              </Link>
            </div>
            <nav
              aria-label="Global"
              className="hidden lg:ml-6 lg:flex lg:items-center lg:space-x-4"
            >
              <Link href="/">
                <a className="px-3 py-2 text-gray-900 text-sm font-medium">Dashboard</a>
              </Link>
              <Link href="/applications">
                <a className="px-3 py-2 text-gray-900 text-sm font-medium">Applications</a>
              </Link>
              <Link href="/customers">
                <a className="px-3 py-2 text-gray-900 text-sm font-medium">Customers</a>
              </Link>
            </nav>
          </div>

          <div className="flex items-center lg:hidden">
            <button
              aria-expanded="false"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              type="button"
              onClick={() => setMenuVisible(true)}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                aria-hidden="true"
                className={cx('h-6 w-6', menuVisible ? 'hidden' : 'block')}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
              <svg
                aria-hidden="true"
                className={cx('h-6 w-6', menuVisible ? 'block' : 'hidden')}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 18L18 6M6 6l12 12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </button>
          </div>
          <div className="hidden lg:ml-4 lg:flex lg:items-center">
            <button
              className="flex-shrink-0 bg-white p-1 text-gray-400 rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              type="button"
            >
              <span className="sr-only">View notifications</span>
              <svg
                aria-hidden="true"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </button>
            <ProfileDropdown />
          </div>
        </div>
      </div>

      <MobileMenu
        visible={menuVisible}
        setVisible={setMenuVisible}
        profile={session?.identity}
      />
    </header>
  )
}

export default Header
