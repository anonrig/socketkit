import PropTypes from "prop-types";
import { Transition } from "@headlessui/react";
import Link from "next/link";
import logo from "../../images/logo-socketkit-color.svg";
import { endpoints } from "../../helpers/kratos.js";

function MobileMenu({ visible, setVisible, profile }) {
  return (
    <Transition
      enter="duration-150 ease-out"
      enterFrom="opacity-0 scale-95"
      enterTo="opacity-100 scale-100"
      leave="duration-150 ease-in"
      leaveFrom="opacity-100 scale-100"
      leaveTo="opacity-0 scale-95"
      show={visible}
    >
      <div className="z-30 absolute top-0 right-0 max-w-none w-full p-2 transition transform origin-top lg:hidden">
        <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y divide-gray-200">
          <div className="pt-3 pb-2">
            <div className="flex items-center justify-between px-4">
              <div>
                <img alt="Socketkit, Inc." className="h-8 w-auto" src={logo} />
              </div>
              <div className="-mr-2">
                <button
                  className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                  type="button"
                  onClick={() => setVisible(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <svg
                    aria-hidden="true"
                    className="h-6 w-6"
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
            </div>
            <div className="mt-3 px-2 space-y-1">
              <Link href="/">
                <a
                  onClick={() => setVisible(false)}
                  className="block rounded-md px-3 py-2 text-base text-gray-900 font-medium hover:bg-gray-100 hover:text-gray-800"
                >
                  Dashboard
                </a>
              </Link>
              <Link href="/applications">
                <a
                  onClick={() => setVisible(false)}
                  className="block rounded-md px-3 py-2 text-base text-gray-900 font-medium hover:bg-gray-100 hover:text-gray-800"
                >
                  Applications
                </a>
              </Link>
              <Link href="/reports">
                <a
                  onClick={() => setVisible(false)}
                  className="block rounded-md px-3 py-2 text-base text-gray-900 font-medium hover:bg-gray-100 hover:text-gray-800"
                >
                  Reports
                </a>
              </Link>
              <Link href="/customers">
                <a
                  onClick={() => setVisible(false)}
                  className="block rounded-md px-3 py-2 text-base text-gray-900 font-medium hover:bg-gray-100 hover:text-gray-800"
                >
                  Customers
                </a>
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
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">
                  {profile?.traits.name}
                </div>
                <div className="text-sm font-medium text-gray-500">
                  {profile?.traits.email}
                </div>
              </div>
              <button className="ml-auto flex-shrink-0 bg-white p-1 text-gray-400 rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
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
            </div>
            <div className="mt-3 px-2 space-y-1">
              <Link href="/settings/account">
                <a
                  className="block rounded-md px-3 py-2 text-base text-gray-900 font-medium hover:bg-gray-100 hover:text-gray-800"
                  onClick={() => setVisible(false)}
                >
                  Account
                </a>
              </Link>
              <Link href="/settings/integrations">
                <a
                  className="block rounded-md px-3 py-2 text-base text-gray-900 font-medium hover:bg-gray-100 hover:text-gray-800"
                  onClick={() => setVisible(false)}
                >
                  Integrations
                </a>
              </Link>
              <a
                href={endpoints.logout}
                className="w-full text-left block rounded-md px-3 py-2 text-base text-gray-900 font-medium hover:bg-gray-100 hover:text-gray-800"
              >
                Log out
              </a>
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
  );
}

MobileMenu.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  profile: PropTypes.shape({
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    email: PropTypes.string,
  }),
};

export default MobileMenu;
