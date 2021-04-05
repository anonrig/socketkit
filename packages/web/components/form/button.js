import PropTypes from 'prop-types'

function Button({ disabled, children, ...props }) {
  return (
    <button
      className={
        'flex justify-center py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500'
      }
      disabled={disabled}
      type={props.type ?? 'submit'}
      {...props}>
      {children}
    </button>
  )
}

Button.propTypes = {
  disabled: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  type: PropTypes.any,
}

export default Button
