import PropTypes from 'prop-types'
import { Fragment } from 'react'
import { Transition, Listbox, Menu } from '@headlessui/react'
import { DeviceMobileIcon, ChevronDownIcon } from '@heroicons/react/outline'
import useSWR from 'swr'

function ApplicationDropdown({ selected, onChange }) {
  const { data } = useSWR('applications')
  const selectedApplication = data?.rows.find(r => r.application_id === selected)

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="w-36 inline-flex justify-center items-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-warmGray-900 hover:bg-warmGray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-orange-500">
        <span className="line-clamp-1 text-left">{selectedApplication?.title ?? 'Applications'}</span>
        <ChevronDownIcon
          className="w-5 h-5 ml-2 -mr-1 text-violet-200 hover:text-violet-100"
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
        <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-1 py-1 ">
            {data?.rows.map((item) => (
              <Menu.Item key={item.application_id}>
                {({ active }) => (
                  <button
                    className={`${active ? 'bg-warmGray-100 text-semibold' : 'text-medium'} group flex rounded-md items-center w-full px-2 py-2 text-sm text-left space-x-4`}
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

ApplicationDropdown.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
}

export default ApplicationDropdown
