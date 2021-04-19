import PropTypes from 'prop-types'
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { DocumentReportIcon } from '@heroicons/react/outline'
import { ChevronDownIcon } from '@heroicons/react/solid'
import cx from 'classnames'

function Dropdown({ selected, items, onChange }) {
  return (
    <Menu as="div" className="relative inline-block z-10">
      {({ open }) => (
        <>
          <Menu.Button className="inline-flex justify-center items-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-warmGray-900 hover:bg-warmGray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-orange-500">
            <DocumentReportIcon className="h-4 w-4 text-orange-500 mr-2" />
            <span>{items.find((i) => i.key === selected)?.label}</span>
            <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" />
          </Menu.Button>
          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95">
            <Menu.Items
              className="absolute right-0 w-28 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none"
              static>
              {items.map((item) => (
                <Menu.Item key={item.key}>
                  {({ active }) => (
                    <button
                      onClick={() => onChange(item)}
                      className={cx(
                        'flex justify-between w-full px-4 py-2 text-sm trailing-5 text-right',
                        active ? 'bg-warmGray-100 text-warmGray-900' : 'text-warmGray-700',
                      )}>
                      {item.label}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  )
}

Dropdown.propTypes = {
  selected: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onChange: PropTypes.func.isRequired,
}

export default Dropdown
