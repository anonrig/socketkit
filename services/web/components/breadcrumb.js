import PropTypes from 'prop-types'
import { ChevronRightIcon } from '@heroicons/react/solid'
import cx from 'classnames'

function Breadcrumb({ steps, className }) {
  return (
    <nav className={cx('flex', className)} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-4">
        {steps.map((step, index) => (
          <li key={step.href}>
            <div className="flex items-center">
              {index !== 0 && (
                <ChevronRightIcon
                  className="flex-shrink-0 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              )}
              <a
                href={step.href}
                className={`${
                  index !== 0 ? 'ml-4' : 'ml-0'
                } text-sm font-medium text-gray-500 hover:text-gray-700`}
                aria-current={index === steps.length - 1 ? 'page' : undefined}>
                {step.title}
              </a>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  )
}

Breadcrumb.propTypes = {
  className: PropTypes.string,
  steps: PropTypes.arrayOf(
    PropTypes.shape({ title: PropTypes.string.isRequired, href: PropTypes.string.isRequired }),
  ),
}

export default Breadcrumb
