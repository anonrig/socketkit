import { Menu, Transition } from '@headlessui/react'
import { UserCircleIcon } from '@heroicons/react/outline'
import cx from 'classnames'

import { AuthContext } from 'helpers/context.js'
import { client } from 'helpers/kratos'
import Link from 'next/link'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import { Fragment, useContext } from 'react'

function ProfileDropdown({ className }) {
  const router = useRouter()
  const { session } = useContext(AuthContext)

  async function logout() {
    const { data } = await client.createSelfServiceLogoutFlowUrlForBrowsers()
    router.replace(data.logout_url)
  }

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
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items
                static
                className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-orange-500 ring-opacity-5 focus:outline-none z-30"
              >
                <div className="px-1 py-1">
                  <Menu.Item>
                    <Link href="/account">
                      <a className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Account Settings
                      </a>
                    </Link>
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
                    <button
                      onClick={() => logout()}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Log out
                    </button>
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
