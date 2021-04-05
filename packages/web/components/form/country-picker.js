import { Transition, Listbox } from '@headlessui/react'
import PropTypes from 'prop-types'
import countries from 'helpers/countries.json'
import cx from 'classnames'
import useVisible from 'helpers/use-visible.js'
import { CheckIcon } from '@heroicons/react/solid'

function CountryPicker({ selected = [], setSelected, disabled }) {
  const { ref, isVisible, setVisible } = useVisible(false)

  const toggle = (el) => {
    if (selected.includes(el)) {
      setSelected(selected.filter((s) => s !== el))
    } else {
      setSelected(selected.splice(0).concat([el]))
    }
  }

  return (
    <Listbox
      as="div"
      className="space-y-1 relative"
      open={isVisible}
      onChange={(value) => toggle(value)}
      disabled={disabled}>
      {() => (
        <div ref={ref}>
          <button
            disabled={disabled}
            type="button"
            onClick={() => {
              setVisible(!isVisible)
            }}
            className="inline-block w-full rounded-md shadow-sm cursor-default rounded-md border border-gray-300 bg-white pl-3 pr-10 py-2 text-left focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition ease-in-out duration-150 sm:text-sm sm:leading-5">
            <span className="block truncate">
              {selected.length ? `${selected.length} countries` : `Not selected`}
            </span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor">
                <path
                  d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>
          <Transition
            show={isVisible}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            className="origin-top-right absolute right-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
            <Listbox.Options
              className="max-h-60 w-56 rounded-md py-1 text-base leading-6 shadow-xs overflow-auto focus:outline-none sm:text-sm sm:leading-5 z-10"
              static>
              {countries.map(({ code, name }) => (
                <Listbox.Option key={code} value={code}>
                  <div
                    className={cx(
                      'cursor-pointer select-none relative py-2 pl-8 pr-4 hover:bg-warmGray-50 bg-white',
                    )}>
                    <div className={cx(selected ? 'font-semibold' : 'font-normal')}>{name}</div>
                    <span
                      className={`${
                        selected.includes(code) ? 'text-orange-500' : 'text-white'
                      } absolute inset-y-0 left-0 flex items-center pl-1.5`}>
                      <CheckIcon className="h-5 w-5" />
                    </span>
                  </div>
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      )}
    </Listbox>
  )
}

CountryPicker.propTypes = {
  disabled: PropTypes.bool.isRequired,
  selected: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  setSelected: PropTypes.func.isRequired,
}

export default CountryPicker
