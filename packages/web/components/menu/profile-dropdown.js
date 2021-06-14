import { Fragment, useContext } from 'react'
import Link from 'next/link'
import { Menu, Transition } from '@headlessui/react'
import { UserCircleIcon } from '@heroicons/react/outline'
import cx from 'classnames'
import PropTypes from 'prop-types'

import { AuthContext } from 'helpers/context.js'
import { endpoints } from 'helpers/kratos'
import { getUrl } from 'helpers/fetcher'

function ProfileDropdown({ className }) {
  const { session } = useContext(AuthContext)

  return (
    <div className={cx(className)}>
      <Menu as="div" className={'relative inline-block text-left'}>
        {({ open }) => (
          <>
            <div>
              <Menu.Button className="rounded-full">
                {session?.identity.traits.picture != null ? (
                  <img
                    alt="Current User"
                    src={session?.identity.traits.picture}
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <UserCircleIcon className="h-8 w-8 rounded-full" />
                )}
              </Menu.Button>
            </div>
            <Transition
              show={open}
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95">
              <Menu.Items
                static
                className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-orange-500 ring-opacity-5 focus:outline-none z-30">
                <div className="px-1 py-1">
                  <Menu.Item>
                    <Link href="/account">
                      <a className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Account Settings
                      </a>
                    </Link>
                  </Menu.Item>
                  <Menu.Item>
                    <a
                      href={getUrl(`payments/portal`)}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Billing & Plan
                    </a>
                  </Menu.Item>
                  <Menu.Item>
                    <Link href="/products">
                      <a className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Products & Integrations
                      </a>
                    </Link>
                  </Menu.Item>
                </div>
                <div className="px-1 py-1">
                  <Menu.Item>
                    <a
                      href={endpoints.logout}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem">
                      Log out
                    </a>
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
    </div>
  )
}

ProfileDropdown.propTypes = {
  className: PropTypes.string,
}

export default ProfileDropdown
