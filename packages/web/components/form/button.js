import PropTypes from 'prop-types'

function Button({ loading, children, ...props }) {
  return (
    <button
      className={
        'transition ease-in-out duration-150 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500'
      }
      disabled={loading}
      type={props.type ?? 'submit'}
      {...props}>
      {children}
    </button>
  )
}

Button.propTypes = {
  loading: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  type: PropTypes.any,
}

export default Button
