import cx from 'classnames'
import PropTypes from 'prop-types'

function Badge({ children, state }) {
  let color = 'bg-warmGray-50 text-warmGray-900'

  if (state === 'danger') {
    color = 'bg-red-50 text-red-800'
  } else if (state === 'info') {
    color = 'bg-blue-50 text-warmGray-900'
  }

  return (
    <span
      className={cx([
        `px-2 py-1 inline-flex text-xs font-semibold rounded-md uppercase min-w-20 text-center justify-center`,
        color,
      ])}
    >
      {children}
    </span>
  )
}

Badge.defaultProps = {
  state: 'success',
}

Badge.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  state: PropTypes.oneOf(['success', 'info', 'danger']).isRequired,
}

export default Badge
