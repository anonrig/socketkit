import { useContext, useState } from 'react'
import cx from 'classnames'
import Link from 'next/link'
import Image from 'next/image'

import MobileMenu from './menu/mobile.js'
import ProfileDropdown from './menu/profile-dropdown.js'
import { AuthContext } from '../helpers/is-authorized.js'
import { useRouter } from 'next/router'

function Header() {
  const router = useRouter()
  const { session } = useContext(AuthContext)
  const [menuVisible, setMenuVisible] = useState(false)
  const getActiveClassName = (path) =>
    router.pathname.startsWith(path) ? 'bg-warmGray-50' : 'bg-white'

  return (
    <header className="bg-white shadow z-10">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex px-2 lg:px-0">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <a className="flex items-center">
                  <Image alt="Socketkit, Inc." width={38} height={38} src="/socketkit-icon.svg" />
                </a>
              </Link>
            </div>
            <nav
              aria-label="Global"
              className="hidden lg:ml-6 lg:flex lg:items-center lg:space-x-4 text-sm font-medium text-warmGray-900">
              <Link href="/applications">
                <a className={cx(['px-3 py-2 rounded-md', getActiveClassName('/applications')])}>
                  Applications
                </a>
              </Link>
              <Link href="/reports/mrr">
                <a className={cx(['px-3 py-2 rounded-md', getActiveClassName('/reports')])}>
                  Reports
                </a>
              </Link>
              <Link href="/customers">
                <a className={cx(['px-3 py-2 rounded-md', getActiveClassName('/customers')])}>
                  Customers
                </a>
              </Link>
            </nav>
          </div>

          <div className="flex items-center lg:hidden z-20">
            <button
              aria-expanded="false"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              type="button"
              onClick={() => setMenuVisible(true)}>
              <span className="sr-only">Open main menu</span>
              <svg
                aria-hidden="true"
                className={cx('h-6 w-6', menuVisible ? 'hidden' : 'block')}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
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
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M6 18L18 6M6 6l12 12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </button>

            <MobileMenu
              visible={menuVisible}
              setVisible={setMenuVisible}
              profile={session?.identity}
            />
          </div>
          <div className="hidden lg:ml-4 lg:flex lg:items-center">
            <ProfileDropdown />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
