import PropTypes from 'prop-types'

function Badge({ children, state }) {
  let color = 'bg-lime-100 text-lime-800'

  if (state === 'danger') {
    color = 'bg-red-100 text-red-800'
  } else if (state === 'info') {
    color = 'bg-amber-100 text-amber-800'
  }

  return (
    <span
      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${color}`}
    >
      {children}
    </span>
  )
}

Badge.defaultProps = {
  state: 'success',
}

Badge.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  state: PropTypes.oneOf(['success', 'info', 'danger']),
}

export default Badge
