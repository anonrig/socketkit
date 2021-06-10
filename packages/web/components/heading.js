import PropTypes from 'prop-types'
import cx from 'classnames'

import Breadcrumb from 'components/breadcrumb'

function Heading({ children, className, steps }) {
  return (
    <>
      {steps && <Breadcrumb steps={steps} className="mb-2" />}

      <div className={cx(['flex-1 min-w-0', className])}>
        <h1 className="font-extrabold text-gray-900 sm:tracking-tight text-3xl">{children}</h1>
      </div>
    </>
  )
}

Heading.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  className: PropTypes.string,
  steps: PropTypes.arrayOf(
    PropTypes.shape({ title: PropTypes.string.isRequired, href: PropTypes.string.isRequired }),
  ),
}

export default Heading
