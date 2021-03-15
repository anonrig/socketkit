import Link from 'next/link'
import PropTypes from 'prop-types'

function Banner({ shortMessage, longMessage, destination }) {
  return (
    <div className="fixed bottom-0 inset-x-0 pb-2 sm:pb-5 z-10">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="p-2 rounded-lg bg-orange-500 shadow-md sm:p-3 sm:px-4">
          <div className="flex items-center justify-between flex-wrap">
            <div className="flex-1 flex items-center">
              <span className="p-2 rounded-full bg-trueGray-100 flex">
                <svg
                  aria-hidden="true"
                  className="h-6 w-6 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </span>
              <p className="ml-3 font-medium text-white truncate">
                <span className="md:hidden">{shortMessage}</span>
                <span className="hidden md:inline">{longMessage}</span>
              </p>
            </div>
            <div className="mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
              <Link href={destination}>
                <a className="flex items-center justify-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-orange-500 bg-white hover:text-orange-400">
                  Add an Integration
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

Banner.propTypes = {
  shortMessage: PropTypes.string.isRequired,
  longMessage: PropTypes.string.isRequired,
  destination: PropTypes.string.isRequired,
}

export default Banner
