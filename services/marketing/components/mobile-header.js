import { Transition } from '@headlessui/react'
import Link from 'next/link'
import useVisible from 'hooks/use-visible.js'

export default function MobileHeader() {
  const { isVisible, setVisible, ref } = useVisible(false)

  return (
    <div className="-mr-2 -my-2 md:hidden z-20" ref={ref}>
      <button
        type="button"
        onClick={() => setVisible(true)}
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

      <Transition
        show={isVisible}
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
                    onClick={() => setVisible(false)}
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
  )
}
