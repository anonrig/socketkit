import PropTypes from 'prop-types'
import cx from 'classnames'

function Heading({ children, className }) {
  return (
    <div className={cx(['flex-1 min-w-0', className])}>
      <h1 className="font-extrabold text-gray-900 sm:tracking-tight text-3xl">{children}</h1>
    </div>
  )
}

Heading.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  className: PropTypes.string,
}

export default Heading
