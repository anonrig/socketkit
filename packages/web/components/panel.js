import PropTypes from 'prop-types'
import { Transition } from '@headlessui/react'
import cx from 'classnames'

function Panel({ isVisible, setVisible, title, subtitle, children }) {
  return (
    <div
      className={cx('fixed inset-0 overflow-hidden', {
        'pointer-events-none': !isVisible,
        'pointer-events-auto': isVisible,
      })}
    >
      <div className="absolute inset-0 overflow-hidden">
        <Transition
          show={isVisible}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        >
          <div
            className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            aria-hidden="true"
          ></div>
        </Transition>

        <section
          className="absolute inset-y-0 right-0 pl-10 max-w-full flex"
          aria-labelledby="slide-over-heading"
        >
          <Transition
            show={isVisible}
            enter="transform transition ease-in-out duration-500 sm:duration-700"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transform transition ease-in-out duration-500 sm:duration-700"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
            className="w-screen max-w-lg"
          >
            <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
              <div className="py-6 px-4 bg-orange-700 sm:px-6">
                <div className="flex items-center justify-between">
                  <h2
                    id="slide-over-heading"
                    className="text-lg font-medium text-white"
                  >
                    {title}
                  </h2>
                  <div className="ml-3 h-7 flex items-center">
                    <button
                      onClick={() => setVisible(false)}
                      className="bg-orange-700 rounded-md text-orange-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                    >
                      <span className="sr-only">Close panel</span>
                      <svg
                        className="h-6 w-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="mt-1">
                  <p className="text-sm text-orange-300">{subtitle}</p>
                </div>
              </div>
              <div className="relative flex-1">
                <div className="absolute inset-0">
                  <div className="h-full overflow-scroll">{children}</div>
                </div>
              </div>
            </div>
          </Transition>
        </section>
      </div>
    </div>
  )
}

Panel.defaultProps = {
  isVisible: false,
  setVisible: () => {},
}

Panel.propTypes = {
  isVisible: PropTypes.bool,
  setVisible: PropTypes.func,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
}

export default Panel
