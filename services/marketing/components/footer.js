import Link from 'next/link'
export default function Footer() {
  return (
    <footer className="bg-warmGray-50" aria-labelledby="footerHeading">
      <h2 className="sr-only">Footer</h2>
      <div className="max-w-7xl mx-auto pt-16 pb-8 px-4 sm:px-6 lg:pt-24 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="grid grid-cols-2 gap-8 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-trueGray-500 tracking-wider uppercase">
                  Solutions
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="/solutions/subscriptions">
                      <a className="text-base text-warmGray-500 hover:text-warmGray-400">
                        Subscriptions
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/solutions/analytics">
                      <a className="text-base text-warmGray-500 hover:text-warmGray-400">
                        Analytics
                      </a>
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-trueGray-500 tracking-wider uppercase">
                  Support
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="/pricing">
                      <a className="text-base text-warmGray-500 hover:text-warmGray-400">
                        Pricing & Plans
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog">
                      <a className="text-base text-warmGray-500 hover:text-warmGray-400">
                        Guides & Tips
                      </a>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-trueGray-500 tracking-wider uppercase">
                  Legal
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="/privacy">
                      <a className="text-base text-warmGray-500 hover:text-warmGray-400">
                        Privacy Policy
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms">
                      <a className="text-base text-warmGray-500 hover:text-warmGray-400">
                        Terms and Conditions
                      </a>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-8 md:flex md:items-center md:justify-between lg:mt-16">
          <div className="flex space-x-6 md:order-2">
            <a
              href="https://github.com/socketkit"
              className="text-trueGray-500 hover:text-trueGray-400">
              <span className="sr-only">GitHub</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
          <p className="mt-8 text-base text-trueGray-500 md:mt-0 md:order-1">
            © 2021 Socketkit, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
