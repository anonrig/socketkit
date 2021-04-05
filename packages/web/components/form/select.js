import PropTypes from 'prop-types'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/solid'
import cx from 'classnames'

function Select({
  selected,
  setSelected,
  values,
  renderer,
  rendererKey,
  subtitleRenderer,
  buttonRenderer,
  position = 'left',
}) {
  const renderSubtitle = (forRow, selected) => {
    const el = subtitleRenderer(forRow)
    return el ? (
      <p className={cx(selected ? 'text-trueGray-500' : 'text-trueGray-500', 'mt-2')}>{el}</p>
    ) : null
  }
  return (
    <Listbox value={selected} onChange={setSelected} className="relative">
      {({ open }) => (
        <div className="relative">
          <Listbox.Button className="relative inline-flex items-center bg-orange-500 py-2 pl-3 pr-0 border border-transparent rounded-md shadow-sm text-white">
            <p className="ml-2.5 text-sm font-medium">{buttonRenderer(selected)}</p>
            <span className="px-2 items-center">
              <ChevronDownIcon className="h-5 w-5 text-white text-sm font-medium" />
            </span>
          </Listbox.Button>
          <Transition
            show={open}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <Listbox.Options
              static
              className={cx(
                'absolute mt-2 w-72 rounded-md shadow-lg overflow-hidden bg-white divide-y divide-trueGray-200 ring-1 ring-orange-400 ring-opacity-5 focus:outline-none',
                position === 'left' ? 'origin-top-left' : 'origin-top-right',
                position === 'left' ? 'left-0' : 'right-0',
              )}>
              {values.map((value) => (
                <Listbox.Option
                  key={value[rendererKey ?? 'id']}
                  value={value[rendererKey ?? 'id']}
                  disabled={value.unavailable}>
                  {({ active, selected, disabled }) => (
                    <div
                      className={cx(
                        'flex flex-col cursor-default select-none relative p-4 text-sm',
                        active ? 'bg-warmGray-50' : 'bg-white',
                        disabled ? 'text-trueGray-200' : 'text-trueGray-900',
                      )}>
                      <div className="flex justify-between">
                        <p className={cx(selected ? 'font-bold' : 'font-semibold')}>
                          {renderer(value)}
                        </p>
                        <span className={cx(selected ? 'text-orange-500' : 'text-white')}>
                          <CheckIcon className="h-5 w-5" />
                        </span>
                      </div>
                      {!!subtitleRenderer && renderSubtitle(value, selected)}
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
  selected: PropTypes.string,
  setSelected: PropTypes.func.isRequired,
  values: PropTypes.arrayOf(PropTypes.any.isRequired),
  renderer: PropTypes.func.isRequired,
  rendererKey: PropTypes.string,
  subtitleRenderer: PropTypes.func,
  buttonRenderer: PropTypes.func.isRequired,
  position: PropTypes.oneOf(['left', 'right']),
}

export default Select
