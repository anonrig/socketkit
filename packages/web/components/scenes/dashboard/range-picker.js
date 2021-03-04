import PropTypes from 'prop-types'
import { Menu, Transition } from '@headlessui/react'
import cx from 'classnames'

function RangePicker({ selected, setSelected, ranges }) {
  return (
    <Menu as="div" className="relative inline-block text-right">
      {({ open }) => (
        <>
          <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-orange-500">
            <span>{selected?.title ?? ranges[0].title}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="-mr-1 ml-2 h-5 w-5">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </Menu.Button>
          <Transition
            show={open}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95">
            <Menu.Items
              className="absolute right-0 w-56 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none"
              static>
              {ranges.map((range) => (
                <Menu.Item key={range.key}>
                  {({ active }) => (
                    <a
                      role="link"
                      onClick={() => setSelected(range)}
                      className={cx(
                        'flex justify-between w-full px-4 py-2 text-sm trailing-5',
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      )}>
                      {range.title}
                    </a>
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

RangePicker.propTypes = {
  selected: PropTypes.shape({
    key: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  setSelected: PropTypes.func.isRequired,
  ranges: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    }),
  ),
}

export default RangePicker
