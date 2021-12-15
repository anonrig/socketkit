import { Transition, Menu } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/outline'
import PropTypes from 'prop-types'
import { Fragment } from 'react'
import useSWR from 'swr'

function ApplicationDropdown({ selected, onChange, hideOnLoading }) {
  const { data, error } = useSWR('applications')
  const application = data?.rows.find((r) => r.application_id === selected)?.title ?? 'Applications'

  if (!data && !error && hideOnLoading) {
    return null
  }

  if (data?.rows?.length <= 1) {
    return null
  }

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="w-36 inline-flex justify-center items-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-stone-900 hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-orange-500">
        <span className="line-clamp-1 text-left">{application}</span>
        <ChevronDownIcon
          className="w-4 h-4 ml-2 -mr-1 text-violet-200 hover:text-violet-100 flex-shrink-0"
          aria-hidden="true"
        />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
          <div className="px-1 py-1 ">
            {data?.rows.map((item) => (
              <Menu.Item key={item.application_id}>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-stone-100 text-semibold' : 'text-medium'
                    } group flex rounded-md items-center w-full px-2 py-2 text-sm text-left space-x-4`}
                    onClick={() => onChange(item.application_id)}
                  >
                    <img
                      src={(item.application_icon ?? '').replaceAll('512', '36')}
                      className="h-5 w-5 rounded-md"
                      alt={item.title}
                    />

                    <span className="line-clamp-1">{item.title}</span>
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

ApplicationDropdown.defaultProps = {
  hideOnLoading: true,
}

ApplicationDropdown.propTypes = {
  hideOnLoading: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  selected: PropTypes.string,
}

export default ApplicationDropdown
