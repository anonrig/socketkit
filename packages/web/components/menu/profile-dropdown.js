import React, { useContext } from 'react'
import { Transition } from '@headlessui/react'
import { UserCircleIcon } from '@heroicons/react/outline'

import Link from 'next/link'
import { AuthContext } from '../../helpers/is-authorized'
import { endpoints } from '../../helpers/kratos'
import useVisible from '../../helpers/use-visible'

function ProfileDropdown() {
  const { session } = useContext(AuthContext)
  const { ref, isVisible, setVisible } = useVisible(false)
  return (
    <div
      // @ts-ignore
      ref={ref}
      className="ml-4 relative flex-shrink-0 z-30">
      <button
        aria-haspopup="true"
        className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        id="user-menu"
        type="button"
        onClick={() => setVisible(!isVisible)}>
        <span className="sr-only">Open user menu</span>
        {session?.identity.traits.picture != null ? (
          <img
            alt="Current User"
            src={session?.identity.traits.picture}
            className="h-8 w-8 rounded-full"
          />
        ) : (
          <UserCircleIcon className="h-8 w-8 rounded-full" />
        )}
      </button>
      <Transition
        aria-labelledby="user-menu"
        aria-orientation="vertical"
        role="menu"
        enter="transition ease-oute duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
        className="z-10 origin-top-right absolute right-0 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100"
        show={isVisible}>
        <div className="py-1" role="none">
          <Link href="/account/settings">
            <button
              className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
              onClick={() => setVisible(false)}>
              Account
          </button>
          </Link>
          <Link href="/account/integrations">
            <button
              className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
              onClick={() => setVisible(false)}>
              Integrations
          </button>
          </Link>
        </div>
        <div className="py-1" role="none">
          <a
            href={endpoints.logout}
            className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            role="menuitem">
            Log out
        </a>
        </div>
      </Transition>
    </div>
  )
}

export default ProfileDropdown
