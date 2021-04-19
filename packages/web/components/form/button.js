import PropTypes from 'prop-types'
import cx from 'classnames'

function Button({ children, className, ...props }) {
  return (
    <button
      className={cx(
        'flex justify-center py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500',
        className,
      )}
      {...props}>
      {children}
    </button>
  )
}

Button.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  className: PropTypes.string,
}

export default Button
