import PropTypes from 'prop-types'
import { Transition } from '@headlessui/react'
import { DateRangePicker } from 'react-date-range'
import dayjs from 'dayjs'
import { ChevronDownIcon } from '@heroicons/react/solid'
import { CalendarIcon } from '@heroicons/react/outline'

import useVisible from 'helpers/use-visible'

function DatePicker({
  interval: { start_date, end_date },
  setInterval,
  maxDate = dayjs().toDate(),
}) {
  const { ref, isVisible, setVisible } = useVisible(false)

  return (
    <div ref={ref} className="relative inline-block z-20">
      <button
        aria-expanded={isVisible}
        aria-haspopup="true"
        className="inline-flex justify-center items-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-orange-500"
        type="button"
        onClick={() => setVisible(!isVisible)}>
        <CalendarIcon className="-ml-1 mr-2 h-4 w-4 text-orange-500 mb-0.5" />
        {start_date.format('DD MMM')} - {end_date.format('DD MMM')}
        <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" />
      </button>
      <Transition
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
        className="origin-top-right absolute right-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
        show={isVisible}>
        <DateRangePicker
          showDateDisplay={false}
          showMonthArrow={false}
          rangeColors={['#f97316']}
          maxDate={maxDate}
          ranges={[
            {
              startDate: start_date.toDate(),
              endDate: end_date.toDate(),
              key: 'selection',
            },
          ]}
          onChange={({ selection }) =>
            setInterval({
              start_date: dayjs(selection.startDate),
              end_date: dayjs(selection.endDate),
            })
          }
        />
      </Transition>
    </div>
  )
}

DatePicker.propTypes = {
  interval: PropTypes.shape({
    start_date: PropTypes.any,
    end_date: PropTypes.any,
  }).isRequired,
  setInterval: PropTypes.func.isRequired,
  maxDate: PropTypes.date,
}

export default DatePicker
