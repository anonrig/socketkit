import { Transition, Listbox } from '@headlessui/react'
import { DocumentReportIcon } from '@heroicons/react/outline'
import PropTypes from 'prop-types'
import { Fragment } from 'react'

const intervals = [
  { key: 'day', label: 'Daily' },
  { key: 'week', label: 'Weekly' },
  { key: 'month', label: 'Monthly' },
]

function IntervalDropdown({ selected, onChange }) {
  const interval = intervals.find((i) => i.key === selected)?.label ?? 'Interval'
  return (
    <Listbox value={selected} onChange={onChange}>
      <div className="relative z-10">
        <Listbox.Button className="inline-flex justify-center items-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-stone-900 hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-orange-500">
          <span className="block truncate flex flex-row items-center min-w-24">
            <DocumentReportIcon className="h-4 w-4 text-orange-500 mr-2" />
            {interval}
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {intervals.map((item) => (
              <Listbox.Option
                key={item.key}
                className={({ active }) =>
                  `${
                    active ? 'text-amber-900 bg-stone-50' : 'text-gray-900'
                  } cursor-pointer select-none relative py-2 px-4 text-right`
                }
                value={item.key}
              >
                {({ selected }) => (
                  <span className={`${selected ? 'font-medium' : 'font-normal'} block truncate`}>
                    {item.label}
                  </span>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  )
}

IntervalDropdown.propTypes = {
  onChange: PropTypes.func.isRequired,
  selected: PropTypes.string,
}

export default IntervalDropdown
