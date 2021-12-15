import { SpeakerphoneIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import PropTypes from 'prop-types'

function Banner({ shortMessage, longMessage }) {
  return (
    <>
      <div className="fixed bottom-0 inset-x-0 pb-2 sm:pb-5 z-10">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="p-2 rounded-lg bg-orange-500 shadow-md sm:p-3 sm:px-4">
            <div className="flex items-center justify-between flex-wrap">
              <div className="flex-1 flex items-center">
                <span className="p-2 rounded-full bg-neutral-100 flex">
                  <SpeakerphoneIcon className="h-6 w-6 text-orange-500" />
                </span>
                <p className="ml-3 font-medium text-white truncate">
                  <span className="md:hidden">{shortMessage}</span>
                  <span className="hidden md:inline">{longMessage}</span>
                </p>
              </div>
              <div className="mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
                <Link href="/products">
                  <a className="flex items-center justify-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-orange-500 bg-white hover:text-orange-400">
                    Add an Integration
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

Banner.propTypes = {
  longMessage: PropTypes.string.isRequired,
  shortMessage: PropTypes.string.isRequired,
}

export default Banner
