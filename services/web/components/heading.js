import cx from 'classnames'

import Breadcrumb from 'components/breadcrumb'
import PropTypes from 'prop-types'

function Heading({ children, className, steps, subtitle, action }) {
  return (
    <>
      {steps && <Breadcrumb steps={steps} className="mb-2" />}

      <div className="flex flex-1 justify-between items-center">
        <div>
          <div className={cx(['flex-1 min-w-0', className])}>
            <h1 className="font-extrabold text-gray-900 sm:tracking-tight text-3xl">{children}</h1>
          </div>

          {subtitle && <p className="mt-1 text-sm text-trueGray-500 mb-8">{subtitle}</p>}
        </div>
        {action && <div className="inline-flex items-center">{action}</div>}
      </div>
    </>
  )
}

Heading.propTypes = {
  action: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  className: PropTypes.string,
  steps: PropTypes.arrayOf(
    PropTypes.shape({ href: PropTypes.string.isRequired, title: PropTypes.string.isRequired }),
  ),
  subtitle: PropTypes.string,
}

export default Heading
