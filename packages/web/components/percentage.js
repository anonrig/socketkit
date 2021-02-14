import PropTypes from 'prop-types'
import cx from 'classnames'
function Percentage({ value, positive }) {
  return (
    <div
      className={cx(
        'inline-flex items-baseline px-2.5 py-0.5 rounded-full text-sm font-medium md:mt-2 lg:mt-0',
        positive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
      )}
    >
      <svg
        aria-hidden="true"
        className={cx(
          '-ml-1 mr-0.5 flex-shrink-0 self-center h-4 w-4',
          positive ? 'text-green-500' : 'text-red-500',
        )}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        {positive ? (
          <path
            fillRule="evenodd"
            d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        ) : (
          <path
            fillRule="evenodd"
            d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        )}
      </svg>
      <span className="sr-only">{positive ? 'Increased' : 'Decreased'} by</span>
      {value}%
    </div>
  )
}

Percentage.defaultProps = {
  positive: true,
}

Percentage.propTypes = {
  value: PropTypes.string.isRequired,
  positive: PropTypes.bool,
}
export default Percentage
