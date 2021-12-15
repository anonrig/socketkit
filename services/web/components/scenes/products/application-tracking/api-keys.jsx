import { ClipboardCopyIcon } from '@heroicons/react/solid'
import PropTypes from 'prop-types'
import toast from 'react-hot-toast'
import { useClipboard } from 'use-clipboard-copy'

function ApplicationTrackingKeys({ application_key, authorization_key }) {
  const clipboard = useClipboard()

  function copy(text) {
    clipboard.copy(text)
    toast.success('Successfully copied the key.')
  }

  return (
    <>
      <div className="shadow sm:rounded-md sm:overflow-hidden">
        <div className="bg-white py-6 px-4 sm:p-6 space-y-2">
          <div className="space-y-4">
            <fieldset className="flex-1">
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="authorization_key"
              >
                Authorization Key
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  className="text-stone-400 appearance-none block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  type="text"
                  value={authorization_key}
                  disabled
                />

                <button
                  className="absolute inset-y-0 right-0 px-3 flex items-center cursor-pointer"
                  onClick={() => copy(authorization_key)}
                >
                  <ClipboardCopyIcon
                    className="h-5 w-5 text-stone-500 hover:text-orange-500"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </fieldset>

            <fieldset className="flex-1">
              <label className="block text-sm font-medium text-gray-700" htmlFor="application_key">
                Signing Key
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  className="text-stone-400 appearance-none block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  type="text"
                  value={application_key}
                  disabled
                />

                <button
                  className="absolute inset-y-0 right-0 px-3 flex items-center cursor-pointer"
                  onClick={() => copy(application_key)}
                >
                  <ClipboardCopyIcon
                    className="h-5 w-5 text-stone-500 hover:text-orange-500"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </fieldset>
          </div>
        </div>
      </div>

      <p className="text-sm text-neutral-900 mt-4">
        More information about how to start integration your application and use Authorization and
        Signing Keys can be found from{' '}
        <a
          href="https://docs.socketkit.com"
          className="font-semibold underline hover:text-orange-500"
          target="_blank"
          rel="noreferrer"
        >
          our documentation.
        </a>
      </p>
    </>
  )
}

ApplicationTrackingKeys.propTypes = {
  application_key: PropTypes.string.isRequired,
  authorization_key: PropTypes.string.isRequired,
}

export default ApplicationTrackingKeys
