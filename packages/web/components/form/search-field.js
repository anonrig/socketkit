import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/solid'
import { InformationCircleIcon } from '@heroicons/react/outline'
import cx from 'classnames'
import { fetcher } from 'helpers/fetcher.js'
import useDebounce from 'helpers/use-debounce.js'


function SearchField({ placeholder, value = null, onValueChange }) {
  const [open, setOpen] = useState(false)
  const [term, setTerm] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const debouncedTerm = useDebounce(term, 500)
  const [application, setApplication] = useState(value)

  const updateApplication = (app) => {
    onValueChange(app)
    setOpen(false)
    setTerm('')
  }

  useEffect(() => {
    async function process() {
      if (debouncedTerm.length > 0) {
        setLoading(true)
        setOpen(true)
        const response = await fetcher(`search/applications`, {
          qs: {
            text: debouncedTerm
          }
        })

        setLoading(false)
        setResults(response)
      } else {
        setLoading(false)
        setOpen(false)
        setResults([])
      }
    }

    process()
  }, [debouncedTerm])

  return (
    <div className="relative z-10">
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
        />
        {application && (<div className="absolute inset-0 rounded-md">
          <div className="flex items-center w-full h-full px-4 space-x-4 bg-white border-gray-300 rounded-md">
            <img src={application.application_icon.replaceAll('512', '64')} alt={application.application_title} className="h-6 w-6 rounded-md" />
            <div className="flex flex-col flex-1 text-left text-sm text-warmGray-700">
              <p className="truncate font-semibold text-sm">{application.application_title}</p>
            </div>
            <button onClick={() => updateApplication(null)}>
              <XIcon className="h-4 w-4 text-red-700" />
            </button>
          </div>
        </div>)}
      </div>
      <Transition
        show={open}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95">
        <div className="z-20 absolute right-0 w-full max-h-56 overflow-scroll mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none">
          {results.length > 0 ? results.map((item) => (
            <button
              type="button"
              key={item.application_id}
              onClick={(e) => {
                updateApplication(item)
              }}
              className={cx(
                'flex items-center w-full px-4 py-2 space-x-4 hover:bg-warmGray-50',
              )}>
              <img src={item.application_icon.replaceAll('512', '64')} alt={item.application_title} className="h-6 w-6 rounded-md" />
              <div className="flex flex-col flex-1 text-left text-sm text-warmGray-700">
                <p className="truncate font-semibold text-sm">{item.application_title}</p>
                <div className="text-xs">{item.bundle_id}</div>
              </div>
            </button>
          )) : loading ? (
            <div className="py-2 px-4 text-left text-sm text-warmGray-700 flex flex-1 flex-row items-center space-x-2">
              <span>Searching...</span>
            </div>
          ) : (
            <div className="py-2 px-4 text-left text-sm text-warmGray-700 flex flex-1 flex-row items-center space-x-2">
              <InformationCircleIcon className="h-6 w-6" /> <span>We coulnd't find any applications on AppStore using the criteria above.</span>
            </div>
          )}
        </div>
      </Transition>
    </div>
  )
}

SearchField.propTypes = {
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.shape({
    application_id: PropTypes.string.isRequired,
    application_title: PropTypes.string.isRequired,
    application_icon: PropTypes.string.isRequired,
    bundle_id: PropTypes.string,
  }),
  onValueChange: PropTypes.func.isRequired
}

export default SearchField
