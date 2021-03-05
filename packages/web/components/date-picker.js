import PropTypes from 'prop-types'
import { Transition } from '@headlessui/react'
import { DateRangePicker } from 'react-date-range'
import dayjs from 'dayjs'

import useVisible from '../helpers/use-visible'
import toast from 'react-hot-toast'

function DatePicker({ interval: { start_date, end_date }, setInterval }) {
  const { ref, isVisible, setVisible } = useVisible(false)

  return (
    <div
      // @ts-ignore
      ref={ref}
      className="relative inline-block z-20">
      <div>
        <button
          aria-expanded="true"
          aria-haspopup="true"
          className="inline-flex justify-center items-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-orange-500"
          id="options-menu"
          type="button"
          onClick={() => setVisible(!isVisible)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="-ml-1 mr-2 h-4 w-4 text-orange-500 mb-0.5">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          {start_date.format('DD MMM')} - {end_date.format('DD MMM')}
          <svg
            aria-hidden="true"
            className="-mr-1 ml-2 h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg">
            <path
              clipRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              fillRule="evenodd"
            />
          </svg>
        </button>
      </div>
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
          maxDate={new Date()}
          ranges={[
            {
              startDate: start_date.toDate(),
              endDate: end_date.toDate(),
              key: 'selection',
            },
          ]}
          // @ts-ignore
          onChange={({ selection }) => {
            toast.success('Date range applied', { duration: 3000 })
            setInterval({
              start_date: dayjs(selection.startDate),
              end_date: dayjs(selection.endDate),
            })
          }}
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
}

export default DatePicker
