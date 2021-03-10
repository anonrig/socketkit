import PropTypes from 'prop-types'
import { Transition } from '@headlessui/react'
import Link from 'next/link'
import Image from 'next/image'
import { endpoints } from 'helpers/kratos.js'

function MobileMenu({ visible, setVisible, profile }) {
  return (
    <Transition
      enter="duration-150 ease-out"
      enterFrom="opacity-0 scale-95"
      enterTo="opacity-100 scale-100"
      leave="duration-150 ease-in"
      leaveFrom="opacity-100 scale-100"
      leaveTo="opacity-0 scale-95"
      show={visible}>
      <div className="z-30 absolute top-0 right-0 max-w-none w-full p-2 transition transform origin-top lg:hidden">
        <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y divide-gray-200">
          <div className="pt-3 pb-2">
            <div className="flex items-center justify-between px-4">
              <div>
                <Image alt="Socketkit, Inc." src="/socketkit-icon.svg" height={40} width={40} />
              </div>
              <div className="-mr-2">
                <button
                  className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                  type="button"
                  onClick={() => setVisible(false)}>
                  <span className="sr-only">Close menu</span>
                  <svg
                    aria-hidden="true"
                    className="h-6 w-6"
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
              </div>
            </div>
            <div className="mt-3 px-2 space-y-1">
              <Link href="/applications">
                <button
                  onClick={() => setVisible(false)}
                  className="block w-full text-left rounded-md px-3 py-2 text-base text-gray-900 font-medium hover:bg-gray-100 hover:text-gray-800">
                  Applications
                </button>
              </Link>
              <Link href="/reports">
                <button
                  onClick={() => setVisible(false)}
                  className="block w-full text-left rounded-md px-3 py-2 text-base text-gray-900 font-medium hover:bg-gray-100 hover:text-gray-800">
                  Reports
                </button>
              </Link>
              <Link href="/customers">
                <button
                  onClick={() => setVisible(false)}
                  className="block w-full text-left rounded-md px-3 py-2 text-base text-gray-900 font-medium hover:bg-gray-100 hover:text-gray-800">
                  Customers
                </button>
              </Link>
            </div>
          </div>
          <div className="pt-4 pb-2">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <svg
                  className="h-10 w-10 rounded-full"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">{profile?.traits.name}</div>
                <div className="text-sm font-medium text-gray-500">{profile?.traits.email}</div>
              </div>
            </div>
            <div className="mt-3 px-2 space-y-1">
              <Link href="/account/settings">
                <button
                  className="w-full text-left block rounded-md px-3 py-2 text-base text-gray-900 font-medium hover:bg-gray-100 hover:text-gray-800"
                  onClick={() => setVisible(false)}>
                  Account
                </button>
              </Link>
              <Link href="/account/integrations">
                <button
                  className="w-full text-left block rounded-md px-3 py-2 text-base text-gray-900 font-medium hover:bg-gray-100 hover:text-gray-800"
                  onClick={() => setVisible(false)}>
                  Integrations
                </button>
              </Link>
              <button
                href={endpoints.logout}
                className="w-full text-left block rounded-md px-3 py-2 text-base text-gray-900 font-medium hover:bg-gray-100 hover:text-gray-800">
                Log out
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="z-20 fixed inset-0 bg-black bg-opacity-25 lg:hidden"
        onClick={() => setVisible(false)}
      />
    </Transition>
  )
}

MobileMenu.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  profile: PropTypes.shape({
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    email: PropTypes.string,
  }),
}

export default MobileMenu
