import cx from 'classnames'
import PropTypes from 'prop-types'

function Button({ children, className, as: AsComponent, ...props }) {
  return (
    <AsComponent
      className={cx(
        'relative flex justify-center py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 cursor-pointer',
        className,
      )}
      {...props}
    >
      {children}
    </AsComponent>
  )
}

Button.defaultProps = {
  as: 'button',
}

Button.propTypes = {
  as: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  className: PropTypes.string,
}

export default Button
