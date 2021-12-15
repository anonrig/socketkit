import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/solid'
import cx from 'classnames'
import PropTypes from 'prop-types'

function Select({
  selected,
  setSelected,
  values,
  renderer,
  rendererKey,
  buttonRenderer,
  buttonIconRenderer,
  position = 'left',
  disabled = false,
}) {
  return (
    <Listbox value={selected} onChange={setSelected} disabled={disabled}>
      {({ open }) => (
        <div className="relative">
          <Listbox.Button
            className="inline-flex justify-center items-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-orange-500"
            disabled={disabled}
          >
            {buttonIconRenderer ? buttonIconRenderer() : null}
            <p className="ml-2.5 text-sm font-medium flex-1 md:flex-0 text-left">
              {buttonRenderer(
                selected,
                values?.find((item) => item[rendererKey.toString()] === selected),
              )}
            </p>
            <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" />
          </Listbox.Button>
          <Transition
            show={open}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              static
              className={cx(
                'z-20 absolute mt-2 w-full md:w-72 rounded-md shadow-lg overflow-hidden bg-white divide-y divide-neutral-200 focus:outline-none',
                position === 'left' ? 'origin-top-left' : 'origin-top-right',
                position === 'left' ? 'left-0' : 'right-0',
              )}
            >
              {values.map((value) => (
                <Listbox.Option
                  key={value[rendererKey ?? 'id']}
                  value={value[rendererKey ?? 'id']}
                  disabled={value.unavailable}
                >
                  {({ active, selected, disabled }) => (
                    <div
                      className={cx(
                        'flex flex-col cursor-default select-none px-4 py-2.5 text-sm',
                        active ? 'bg-stone-50' : 'bg-white',
                        disabled ? 'text-neutral-200' : 'text-neutral-900',
                      )}
                    >
                      <div className="flex justify-between">
                        <p className={cx(selected ? 'font-bold' : 'font-semibold')}>
                          {renderer(value)}
                        </p>
                        <CheckIcon
                          className={cx(selected ? 'text-orange-500' : 'text-white', 'h-5 w-5')}
                        />
                      </div>
                    </div>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      )}
    </Listbox>
  )
}

Select.propTypes = {
  buttonIconRenderer: PropTypes.func,
  buttonRenderer: PropTypes.func.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  position: PropTypes.oneOf(['left', 'right']),
  renderer: PropTypes.func.isRequired,
  rendererKey: PropTypes.string,
  selected: PropTypes.string,
  setSelected: PropTypes.func.isRequired,
  values: PropTypes.arrayOf(PropTypes.any.isRequired),
}

export default Select
